/**
 * Controlador Principal de la Aplicación de Jerarquía de Operaciones
 */

class MathApp {
  constructor() {
    this.statsKey = 'math_pemdas_stats';
    this.inputModeKey = 'math_pemdas_input_mode';
    this.levelKey = 'math_pemdas_level';

    // Estado de estadísticas
    this.stats = this.loadStats();

    // Estado del juego
    this.currentLevel = this.loadLevel();
    this.currentExercise = null;
    this.inputMode = this.loadInputMode(); // 'touch' o 'native'
    this.isAnswerChecked = false;

    // Elementos DOM
    this.mainExpr = document.getElementById('main-expression');
    this.answerInput = document.getElementById('answer-input');
    this.feedbackBanner = document.getElementById('feedback-banner');
    this.virtualKeypad = document.getElementById('virtual-keypad');
    this.btnCheck = document.getElementById('btn-check-answer');
    this.btnNext = document.getElementById('btn-next-exercise');
    this.btnShowSteps = document.getElementById('btn-show-steps');

    // Modales
    this.stepsModal = document.getElementById('steps-modal');
    this.settingsModal = document.getElementById('settings-modal');
    this.guideModal = document.getElementById('guide-modal');
    this.resetModal = document.getElementById('reset-confirm-modal');

    this.init();
  }

  loadStats() {
    const defaultStats = { correct: 0, streak: 0, bestStreak: 0, errors: 0 };
    try {
      const saved = localStorage.getItem(this.statsKey);
      if (saved) {
        return { ...defaultStats, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.warn('Could not load stats from localStorage:', e);
    }
    return defaultStats;
  }

  saveStats() {
    try {
      localStorage.setItem(this.statsKey, JSON.stringify(this.stats));
    } catch (e) {
      console.warn('Could not save stats to localStorage:', e);
    }
  }

  loadLevel() {
    try {
      const saved = localStorage.getItem(this.levelKey);
      if (saved && ['easy', 'medium', 'hard'].includes(saved)) {
        return saved;
      }
    } catch (e) {}
    return 'easy';
  }

  saveLevel(lvl) {
    this.currentLevel = lvl;
    try {
      localStorage.setItem(this.levelKey, lvl);
    } catch (e) {}
  }

  loadInputMode() {
    try {
      const saved = localStorage.getItem(this.inputModeKey);
      if (saved && ['touch', 'native'].includes(saved)) {
        return saved;
      }
    } catch (e) {}
    // Por defecto en móviles o táctil iniciamos con teclado táctil
    return 'touch';
  }

  saveInputMode(mode) {
    this.inputMode = mode;
    try {
      localStorage.setItem(this.inputModeKey, mode);
    } catch (e) {}
  }

  init() {
    // Inicializar i18n
    window.i18n?.init();

    // Actualizar UI con estadísticas iniciales
    this.renderStats();

    // Configurar nivel inicial en selector
    this.updateLevelSelector();

    // Configurar modo de entrada (Teclado Táctil / Nativo)
    this.updateInputModeUI();

    // Eventos
    this.setupEventListeners();

    // Generar primer ejercicio
    this.nextExercise(false);

    // Escuchar cambios de idioma
    window.addEventListener('languageChanged', () => {
      this.renderStats();
      this.updateExerciseDisplay();
      if (this.stepsModal && !this.stepsModal.classList.contains('hidden')) {
        this.renderSteps();
      }
    });

    // Registrar Service Worker para PWA / Offline
    this.registerServiceWorker();
  }

  setupEventListeners() {
    // Selector de Dificultad
    document.querySelectorAll('[data-level]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const lvl = btn.getAttribute('data-level');
        if (lvl && lvl !== this.currentLevel) {
          this.saveLevel(lvl);
          this.updateLevelSelector();
          this.nextExercise(true);
          window.soundSystem?.playClick();
        }
      });
    });

    // Alternador de Modo de Entrada (Táctil vs Móvil)
    document.getElementById('mode-touch-btn')?.addEventListener('click', () => {
      this.saveInputMode('touch');
      this.updateInputModeUI();
      window.soundSystem?.playClick();
    });
    document.getElementById('mode-native-btn')?.addEventListener('click', () => {
      this.saveInputMode('native');
      this.updateInputModeUI();
      window.soundSystem?.playClick();
    });

    // Botones del Teclado Táctil
    document.querySelectorAll('[data-key]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const key = btn.getAttribute('data-key');
        this.handleKeypadInput(key);
      });
    });

    // Input nativo: presionar Enter para comprobar
    if (this.answerInput) {
      this.answerInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          this.checkAnswer();
        }
      });

      this.answerInput.addEventListener('input', (e) => {
        window.whiteboard?.syncAnswerFromMain(e.target.value);
      });
    }

    // Botón Comprobar Respuesta principal
    this.btnCheck?.addEventListener('click', () => {
      this.checkAnswer();
    });

    // Botón Siguiente Ejercicio
    this.btnNext?.addEventListener('click', () => {
      this.nextExercise(true);
      window.soundSystem?.playClick();
    });

    // Botón Ver Paso a Paso
    this.btnShowSteps?.addEventListener('click', () => {
      this.openStepsModal();
    });
    document.getElementById('btn-close-steps')?.addEventListener('click', () => {
      this.closeStepsModal();
    });

    // Modal de Reglas / Guía
    document.querySelectorAll('[data-action="open-guide"]').forEach(btn => {
      btn.addEventListener('click', () => this.openGuideModal());
    });
    document.getElementById('btn-close-guide')?.addEventListener('click', () => {
      this.closeGuideModal();
    });

    // Modal de Ajustes
    document.getElementById('btn-open-settings')?.addEventListener('click', () => {
      this.openSettingsModal();
    });
    document.getElementById('btn-close-settings')?.addEventListener('click', () => {
      this.closeSettingsModal();
    });

    // Toggle de Sonido en Ajustes
    const soundToggle = document.getElementById('sound-toggle-btn');
    if (soundToggle) {
      this.updateSoundToggleUI();
      soundToggle.addEventListener('click', () => {
        const newState = !window.soundSystem?.enabled;
        window.soundSystem?.setSoundEnabled(newState);
        this.updateSoundToggleUI();
        if (newState) window.soundSystem?.playClick();
      });
    }

    // Modal de Confirmación de Reinicio de Estadísticas
    document.getElementById('btn-open-reset-confirm')?.addEventListener('click', () => {
      this.openResetConfirmModal();
    });
    document.getElementById('btn-confirm-reset-stats')?.addEventListener('click', () => {
      this.resetStats();
    });
    document.getElementById('btn-cancel-reset-stats')?.addEventListener('click', () => {
      this.closeResetConfirmModal();
    });

    // Cerrar modales con clic fuera del contenedor
    [this.stepsModal, this.settingsModal, this.guideModal, this.resetModal].forEach(modal => {
      if (modal) {
        modal.addEventListener('click', (e) => {
          if (e.target === modal) {
            modal.classList.add('hidden');
            document.body.classList.remove('overflow-hidden');
          }
        });
      }
    });
  }

  updateLevelSelector() {
    document.querySelectorAll('[data-level]').forEach(btn => {
      const lvl = btn.getAttribute('data-level');
      if (lvl === this.currentLevel) {
        btn.classList.add('bg-indigo-600', 'text-white', 'shadow-md', 'ring-2', 'ring-indigo-400');
        btn.classList.remove('bg-slate-800', 'text-slate-300', 'hover:bg-slate-700');
        btn.setAttribute('aria-pressed', 'true');
      } else {
        btn.classList.remove('bg-indigo-600', 'text-white', 'shadow-md', 'ring-2', 'ring-indigo-400');
        btn.classList.add('bg-slate-800', 'text-slate-300', 'hover:bg-slate-700');
        btn.setAttribute('aria-pressed', 'false');
      }
    });
  }

  updateInputModeUI() {
    const btnTouch = document.getElementById('mode-touch-btn');
    const btnNative = document.getElementById('mode-native-btn');

    if (this.inputMode === 'touch') {
      btnTouch?.classList.add('bg-indigo-600', 'text-white', 'shadow-sm');
      btnTouch?.classList.remove('text-slate-400', 'hover:text-slate-200');

      btnNative?.classList.remove('bg-indigo-600', 'text-white', 'shadow-sm');
      btnNative?.classList.add('text-slate-400', 'hover:text-slate-200');

      if (this.virtualKeypad) {
        this.virtualKeypad.classList.remove('hidden');
      }
      if (this.answerInput) {
        this.answerInput.setAttribute('readonly', 'true');
      }
    } else {
      btnNative?.classList.add('bg-indigo-600', 'text-white', 'shadow-sm');
      btnNative?.classList.remove('text-slate-400', 'hover:text-slate-200');

      btnTouch?.classList.remove('bg-indigo-600', 'text-white', 'shadow-sm');
      btnTouch?.classList.add('text-slate-400', 'hover:text-slate-200');

      if (this.virtualKeypad) {
        this.virtualKeypad.classList.add('hidden');
      }
      if (this.answerInput) {
        this.answerInput.removeAttribute('readonly');
        this.answerInput.focus();
      }
    }
  }

  updateSoundToggleUI() {
    const soundToggle = document.getElementById('sound-toggle-btn');
    const soundIcon = document.getElementById('sound-toggle-icon');
    const soundText = document.getElementById('sound-toggle-text');
    const isEnabled = window.soundSystem?.enabled;

    if (soundToggle && soundIcon && soundText) {
      if (isEnabled) {
        soundToggle.classList.add('bg-emerald-600', 'text-white');
        soundToggle.classList.remove('bg-slate-800', 'text-slate-400');
        soundIcon.textContent = '🔊';
        soundText.textContent = window.i18n ? window.i18n.t('soundEnabled') : 'Sonido activado';
      } else {
        soundToggle.classList.remove('bg-emerald-600', 'text-white');
        soundToggle.classList.add('bg-slate-800', 'text-slate-400');
        soundIcon.textContent = '🔇';
        soundText.textContent = window.i18n ? window.i18n.t('soundDisabled') : 'Sonido silenciado';
      }
    }
  }

  handleKeypadInput(key) {
    if (!this.answerInput) return;
    window.soundSystem?.playClick();

    let val = this.answerInput.value;

    if (key === 'clear') {
      val = '';
    } else if (key === 'backspace') {
      val = val.slice(0, -1);
    } else if (key === 'minus') {
      if (val === '') {
        val = '-';
      } else if (val === '-') {
        val = '';
      }
    } else if (key === 'submit') {
      this.checkAnswer();
      return;
    } else {
      // Dígito 0-9
      if (val.length < 8) {
        val += key;
      }
    }

    this.answerInput.value = val;
    window.whiteboard?.syncAnswerFromMain(val);
  }

  nextExercise(clearCanvas = true) {
    this.currentExercise = window.mathEngine.generate(this.currentLevel);
    this.isAnswerChecked = false;

    // Limpiar input y mensaje
    if (this.answerInput) this.answerInput.value = '';
    window.whiteboard?.syncAnswerFromMain('');

    this.hideFeedback();

    if (this.btnNext) this.btnNext.classList.add('hidden');
    if (this.btnCheck) this.btnCheck.classList.remove('hidden');

    this.updateExerciseDisplay();

    // Pizarra: si se solicita o tras acierto, se limpia automáticamente
    if (clearCanvas) {
      window.whiteboard?.resetForNewExercise();
    }
  }

  updateExerciseDisplay() {
    if (!this.currentExercise || !this.mainExpr) return;

    // Expresión en pantalla con tipografía moderna y formato
    this.mainExpr.textContent = this.currentExercise.displayExpr;

    // Actualizar banner en la cabecera de la pizarra táctil
    window.whiteboard?.setBannerExpression(this.currentExercise.displayExpr);
  }

  renderStats() {
    const lang = window.i18n ? window.i18n.getLang() : 'es';
    const numFormatter = new Intl.NumberFormat(lang === 'es' ? 'es-ES' : 'en-US');

    const elCorrect = document.getElementById('stat-correct-count');
    const elStreak = document.getElementById('stat-streak-count');
    const elBestStreak = document.getElementById('stat-best-streak-count');
    const elErrors = document.getElementById('stat-errors-count');

    if (elCorrect) elCorrect.textContent = numFormatter.format(this.stats.correct);
    if (elStreak) elStreak.textContent = numFormatter.format(this.stats.streak);
    if (elBestStreak) elBestStreak.textContent = numFormatter.format(this.stats.bestStreak);
    if (elErrors) elErrors.textContent = numFormatter.format(this.stats.errors);

    // Animación de fuego para rachas altas
    const streakCard = document.getElementById('stat-streak-card');
    if (streakCard) {
      if (this.stats.streak >= 3) {
        streakCard.classList.add('ring-2', 'ring-amber-500', 'shadow-amber-500/30', 'shadow-lg');
      } else {
        streakCard.classList.remove('ring-2', 'ring-amber-500', 'shadow-amber-500/30', 'shadow-lg');
      }
    }
  }

  checkAnswer() {
    if (!this.currentExercise || !this.answerInput) return;

    const rawInput = this.answerInput.value.trim();

    if (rawInput === '' || isNaN(rawInput)) {
      this.showFeedback('warning', window.i18n.t('feedbackEmpty'));
      window.soundSystem?.playError();
      this.shakeCard();
      return;
    }

    const userAnswer = parseInt(rawInput, 10);
    const correctAnswer = this.currentExercise.answer;

    if (userAnswer === correctAnswer) {
      // --- RESPUESTA CORRECTA ---
      this.stats.correct++;
      this.stats.streak++;
      if (this.stats.streak > this.stats.bestStreak) {
        this.stats.bestStreak = this.stats.streak;
      }
      this.saveStats();
      this.renderStats();

      // Confeti y Sonido
      window.confetti?.launch(80);
      if (this.stats.streak >= 3 && this.stats.streak % 3 === 0) {
        window.soundSystem?.playStreak();
      } else {
        window.soundSystem?.playCorrect();
      }

      // Feedback visual
      let msg = window.i18n.t('feedbackCorrect');
      if (this.stats.streak >= 3) {
        msg += ` ${window.i18n.t('feedbackStreakBonus', { streak: this.stats.streak })}`;
      }
      this.showFeedback('success', msg);

      this.isAnswerChecked = true;
      if (this.btnCheck) this.btnCheck.classList.add('hidden');
      if (this.btnNext) this.btnNext.classList.remove('hidden');

      // Vacia la pizarra automáticamente para el nuevo ejercicio según requisito
      window.whiteboard?.resetForNewExercise();

      // Si la pizarra estaba abierta, cerrar o notificar
      if (window.whiteboard?.isOpen()) {
        setTimeout(() => {
          window.whiteboard.close();
        }, 1200);
      }

      // Auto-avance suave después de 1.8 segundos si no presiona Siguiente
      setTimeout(() => {
        if (this.isAnswerChecked) {
          this.nextExercise(true);
        }
      }, 1900);

    } else {
      // --- RESPUESTA INCORRECTA ---
      this.stats.errors++;
      this.stats.streak = 0; // Resetea la racha
      this.saveStats();
      this.renderStats();

      window.soundSystem?.playError();
      this.shakeCard();

      // Mantiene el MISMO ejercicio para reintentar (conservando notas de pizarra)
      this.showFeedback('error', window.i18n.t('feedbackWrong'));

      // Limpia solo el campo de respuesta para permitir escribir de nuevo
      this.answerInput.value = '';
      window.whiteboard?.syncAnswerFromMain('');
      if (this.inputMode === 'native') {
        this.answerInput.focus();
      }
    }
  }

  shakeCard() {
    const card = document.getElementById('exercise-card');
    if (card) {
      card.classList.remove('animate-shake');
      void card.offsetWidth; // Force reflow
      card.classList.add('animate-shake');
      setTimeout(() => card.classList.remove('animate-shake'), 600);
    }
  }

  showFeedback(type, text) {
    if (!this.feedbackBanner) return;
    this.feedbackBanner.classList.remove('hidden', 'bg-emerald-950/80', 'text-emerald-200', 'border-emerald-600',
      'bg-rose-950/80', 'text-rose-200', 'border-rose-600',
      'bg-amber-950/80', 'text-amber-200', 'border-amber-600');

    if (type === 'success') {
      this.feedbackBanner.classList.add('bg-emerald-950/80', 'text-emerald-200', 'border-emerald-600');
    } else if (type === 'error') {
      this.feedbackBanner.classList.add('bg-rose-950/80', 'text-rose-200', 'border-rose-600');
    } else {
      this.feedbackBanner.classList.add('bg-amber-950/80', 'text-amber-200', 'border-amber-600');
    }

    this.feedbackBanner.textContent = text;
  }

  hideFeedback() {
    if (this.feedbackBanner) {
      this.feedbackBanner.classList.add('hidden');
      this.feedbackBanner.textContent = '';
    }
  }

  // Modales
  openStepsModal() {
    if (!this.stepsModal || !this.currentExercise) return;
    this.renderSteps();
    this.stepsModal.classList.remove('hidden');
    document.body.classList.add('overflow-hidden');
    window.soundSystem?.playClick();
  }

  renderSteps() {
    const container = document.getElementById('steps-content-list');
    if (!container || !this.currentExercise) return;

    const lang = window.i18n ? window.i18n.getLang() : 'es';
    const steps = lang === 'en' ? this.currentExercise.stepsEn : this.currentExercise.stepsEs;

    let html = `<div class="mb-4 p-3 bg-indigo-950/60 border border-indigo-500/40 rounded-xl text-center">
      <span class="text-xs text-indigo-300 uppercase tracking-widest block font-bold">${window.i18n.t('wbExpressionBanner')}</span>
      <span class="text-2xl font-mono font-extrabold text-white">${this.currentExercise.displayExpr}</span>
    </div><ol class="space-y-3">`;

    steps.forEach((step, idx) => {
      html += `
        <li class="flex items-start gap-3 p-3.5 bg-slate-800/90 rounded-xl border border-slate-700/60 shadow-sm">
          <span class="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-full bg-indigo-600 text-white font-bold text-xs ring-2 ring-indigo-400">
            ${idx + 1}
          </span>
          <div class="text-sm text-slate-200 leading-relaxed font-medium">
            ${step}
          </div>
        </li>
      `;
    });

    html += `</ol>
      <div class="mt-4 p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-xl text-center">
        <span class="text-xs text-emerald-300 uppercase tracking-wider block font-bold">${window.i18n.t('stepResultFinal')}</span>
        <span class="text-2xl font-mono font-black text-emerald-400">${this.currentExercise.answer}</span>
      </div>
    `;

    container.innerHTML = html;
  }

  closeStepsModal() {
    if (this.stepsModal) {
      this.stepsModal.classList.add('hidden');
      document.body.classList.remove('overflow-hidden');
      window.soundSystem?.playClick();
    }
  }

  openGuideModal() {
    if (this.guideModal) {
      this.guideModal.classList.remove('hidden');
      document.body.classList.add('overflow-hidden');
      window.soundSystem?.playClick();
    }
  }

  closeGuideModal() {
    if (this.guideModal) {
      this.guideModal.classList.add('hidden');
      document.body.classList.remove('overflow-hidden');
      window.soundSystem?.playClick();
    }
  }

  openSettingsModal() {
    if (this.settingsModal) {
      this.settingsModal.classList.remove('hidden');
      document.body.classList.add('overflow-hidden');
      window.soundSystem?.playClick();
    }
  }

  closeSettingsModal() {
    if (this.settingsModal) {
      this.settingsModal.classList.add('hidden');
      document.body.classList.remove('overflow-hidden');
      window.soundSystem?.playClick();
    }
  }

  openResetConfirmModal() {
    if (this.resetModal) {
      this.resetModal.classList.remove('hidden');
      window.soundSystem?.playClick();
    }
  }

  closeResetConfirmModal() {
    if (this.resetModal) {
      this.resetModal.classList.add('hidden');
      window.soundSystem?.playClick();
    }
  }

  resetStats() {
    this.stats = { correct: 0, streak: 0, bestStreak: 0, errors: 0 };
    this.saveStats();
    this.renderStats();
    this.closeResetConfirmModal();
    this.closeSettingsModal();
    window.soundSystem?.playCorrect();
  }

  registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
          .then(reg => {
            console.log('ServiceWorker registrado con éxito:', reg.scope);
            const offlineBadge = document.getElementById('offline-badge');
            if (offlineBadge) {
              offlineBadge.classList.remove('hidden');
            }
          })
          .catch(err => {
            console.warn('Error al registrar ServiceWorker:', err);
          });
      });
    }
  }
}

// Inicializar la aplicación al cargar el DOM
document.addEventListener('DOMContentLoaded', () => {
  window.app = new MathApp();
});
