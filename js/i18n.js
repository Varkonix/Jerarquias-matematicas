/**
 * Sistema de Internacionalización (i18n) para Jerarquía de Operaciones (PAPOMUDAS / PEMDAS)
 */

const translations = {
  es: {
    // Header & Meta
    appTitle: "Jerarquía de Operaciones",
    appSubtitle: "Entrenador interactivo PAPOMUDAS",
    ruleBadge: "Regla PAPOMUDAS",
    
    // Stats
    statCorrect: "Aciertos",
    statStreak: "Racha Actual",
    statBestStreak: "Mejor Racha",
    statErrors: "Errores",
    
    // Levels
    levelEasy: "Fácil",
    levelEasyDesc: "3 números sin paréntesis",
    levelMedium: "Medio",
    levelMediumDesc: "Con paréntesis simples",
    levelHard: "Avanzado",
    levelHardDesc: "Operaciones combinadas completas",
    levelSelectLabel: "Nivel de dificultad",

    // Main Card
    exerciseTitle: "Resuelve respetando la jerarquía:",
    yourAnswer: "Tu respuesta:",
    inputPlaceholder: "Escribe tu resultado...",
    btnCheck: "Comprobar Respuesta",
    btnWhiteboard: "Pizarra Táctil",
    btnShowSteps: "Ver Paso a Paso",
    btnNext: "Siguiente Ejercicio",
    
    // Keypad Toggle
    inputModeLabel: "Modo de Entrada:",
    modeTouch: "Teclado Táctil",
    modeNative: "Teclado Móvil",
    
    // Keypad buttons
    keypadClear: "C",
    keypadDelete: "⌫",
    keypadSubmit: "OK",
    
    // Whiteboard Modal
    wbTitle: "Pizarra de Borrador",
    wbExpressionBanner: "Expresión actual:",
    wbToolPencil: "Lápiz",
    wbToolEraser: "Goma",
    wbToolText: "Texto",
    wbClearAll: "Limpiar Todo",
    wbUndo: "Deshacer",
    wbRedo: "Rehacer",
    wbStrokeSize: "Grosor",
    wbColor: "Color",
    wbClose: "Minimizar Pizarra",
    wbCheckAnswer: "Comprobar",
    wbTextPromptTitle: "Escribir en la pizarra",
    wbTextPlaceholder: "Números o símbolos...",
    wbInsertText: "Insertar",
    wbCancel: "Cancelar",
    wbTip: "💡 Puedes escribir a mano o usar la herramienta de texto para ordenar tus pasos.",
    
    // Settings Modal
    settingsTitle: "Ajustes",
    settingsLanguageSection: "Idioma / Language",
    langEs: "Español (Base)",
    langEn: "English (US)",
    settingsSoundSection: "Efectos de Sonido",
    soundEnabled: "Sonido activado",
    soundDisabled: "Sonido silenciado",
    settingsStatsSection: "Gestión de Datos",
    btnResetStats: "Reiniciar Estadísticas",
    resetConfirmTitle: "¿Reiniciar estadísticas?",
    resetConfirmText: "Esta acción pondrá en 0 tus aciertos, rachas y errores.",
    btnConfirmReset: "Sí, reiniciar",
    btnCancel: "Cancelar",
    settingsClose: "Cerrar Ajustes",
    
    // PEMDAS / PAPOMUDAS Guide Modal
    guideTitle: "Guía: Jerarquía de Operaciones",
    guideIntro: "Para resolver cualquier cálculo sin equivocarte, sigue el orden oficial:",
    ruleP_title: "1. PA - Paréntesis ( ) [ ] { }",
    ruleP_desc: "Se resuelven primero las operaciones que están dentro de los paréntesis más internos.",
    ruleO_title: "2. PO - Potencias y Raíces",
    ruleO_desc: "Luego se calculan las potencias y raíces de izquierda a derecha.",
    ruleMU_title: "3. MU / D - Multiplicación y División × ÷",
    ruleMU_desc: "Tienen la MISMA prioridad. Se resuelven de izquierda a derecha a medida que aparecen.",
    ruleAS_title: "4. AS - Adición y Sustracción + −",
    ruleAS_desc: "Al final, se suman y restan los términos de izquierda a derecha.",
    guideTip: "💡 Regla de oro: Si dos operaciones tienen la misma jerarquía (ej. × y ÷, o + y −), resuélvelas estrictamente de izquierda a derecha.",
    guideClose: "Entendido",
    
    // Steps Modal
    stepsTitle: "Resolución Paso a Paso",
    stepsSubtitle: "Cómo resolver aplicando PAPOMUDAS:",
    stepItem: "Paso {{num}}:",
    stepResultFinal: "Resultado final:",
    stepsClose: "Continuar Practicando",

    // Feedback Messages
    feedbackCorrect: "¡Excelente! Respuesta correcta 🎉",
    feedbackStreakBonus: "¡Racha de {{streak}} aciertos seguidos! 🔥",
    feedbackWrong: "¡Casi! Revisa la jerarquía de las operaciones e inténtalo otra vez.",
    feedbackEmpty: "Por favor ingresa un número antes de comprobar.",
    
    // Dynamic Stats
    statsSummary: "Aciertos: {{count}}",
    currentStreakDisplay: "Racha: {{count}} 🔥",
    errorsDisplay: "Errores: {{count}}",
    
    // Offline / PWA status
    offlineReady: "App lista para usar sin conexión (Offline)",
    installApp: "Instalar Aplicación"
  },
  
  en: {
    // Header & Meta
    appTitle: "Order of Operations",
    appSubtitle: "Interactive PEMDAS Trainer",
    ruleBadge: "PEMDAS Rule",
    
    // Stats
    statCorrect: "Total Correct",
    statStreak: "Current Streak",
    statBestStreak: "Best Streak",
    statErrors: "Total Mistakes",
    
    // Levels
    levelEasy: "Easy",
    levelEasyDesc: "3 numbers without parentheses",
    levelMedium: "Medium",
    levelMediumDesc: "With simple parentheses",
    levelHard: "Advanced",
    levelHardDesc: "Full combined operations",
    levelSelectLabel: "Difficulty level",

    // Main Card
    exerciseTitle: "Solve following the order of operations:",
    yourAnswer: "Your answer:",
    inputPlaceholder: "Enter your answer...",
    btnCheck: "Check Answer",
    btnWhiteboard: "Scratchpad Canvas",
    btnShowSteps: "Show Steps",
    btnNext: "Next Exercise",
    
    // Keypad Toggle
    inputModeLabel: "Input Mode:",
    modeTouch: "Virtual Keypad",
    modeNative: "Device Keyboard",
    
    // Keypad buttons
    keypadClear: "C",
    keypadDelete: "⌫",
    keypadSubmit: "OK",
    
    // Whiteboard Modal
    wbTitle: "Touch Whiteboard Scratchpad",
    wbExpressionBanner: "Current expression:",
    wbToolPencil: "Pencil",
    wbToolEraser: "Eraser",
    wbToolText: "Text",
    wbClearAll: "Clear All",
    wbUndo: "Undo",
    wbRedo: "Redo",
    wbStrokeSize: "Width",
    wbColor: "Color",
    wbClose: "Minimize Canvas",
    wbCheckAnswer: "Check",
    wbTextPromptTitle: "Write on canvas",
    wbTextPlaceholder: "Numbers or symbols...",
    wbInsertText: "Insert",
    wbCancel: "Cancel",
    wbTip: "💡 Draw freely with your finger/mouse or use the text tool to write your calculations.",
    
    // Settings Modal
    settingsTitle: "Settings",
    settingsLanguageSection: "Idioma / Language",
    langEs: "Español (Base)",
    langEn: "English (US)",
    settingsSoundSection: "Sound Effects",
    soundEnabled: "Sound enabled",
    soundDisabled: "Sound muted",
    settingsStatsSection: "Data & Progress",
    btnResetStats: "Reset Statistics",
    resetConfirmTitle: "Reset statistics?",
    resetConfirmText: "This action will reset your correct answers, streaks, and mistakes to 0.",
    btnConfirmReset: "Yes, reset",
    btnCancel: "Cancel",
    settingsClose: "Close Settings",
    
    // PEMDAS / PAPOMUDAS Guide Modal
    guideTitle: "Guide: Order of Operations",
    guideIntro: "To solve any mathematical expression correctly, always follow PEMDAS:",
    ruleP_title: "1. P - Parentheses ( ) [ ] { }",
    ruleP_desc: "First, evaluate everything inside grouping symbols starting with the innermost.",
    ruleO_title: "2. E - Exponents & Roots",
    ruleO_desc: "Next, evaluate all powers and roots from left to right.",
    ruleMU_title: "3. MD - Multiplication & Division × ÷",
    ruleMU_desc: "These have EQUAL priority. Calculate them from left to right as they appear.",
    ruleAS_title: "4. AS - Addition & Subtraction + −",
    ruleAS_desc: "Finally, perform addition and subtraction from left to right.",
    guideTip: "💡 Golden Rule: When operations have equal priority (like × and ÷, or + and −), resolve strictly from left to right.",
    guideClose: "Got it",
    
    // Steps Modal
    stepsTitle: "Step-by-Step Solution",
    stepsSubtitle: "How to solve using PEMDAS:",
    stepItem: "Step {{num}}:",
    stepResultFinal: "Final result:",
    stepsClose: "Keep Practicing",

    // Feedback Messages
    feedbackCorrect: "Awesome! Correct answer 🎉",
    feedbackStreakBonus: "{{streak}} in a row! Streak on fire! 🔥",
    feedbackWrong: "Almost! Review the order of operations and try again.",
    feedbackEmpty: "Please enter a number before checking.",
    
    // Dynamic Stats
    statsSummary: "Correct: {{count}}",
    currentStreakDisplay: "Streak: {{count}} 🔥",
    errorsDisplay: "Mistakes: {{count}}",
    
    // Offline / PWA status
    offlineReady: "App ready for 100% offline use",
    installApp: "Install App"
  }
};

class I18nManager {
  constructor() {
    this.storageKey = 'math_pemdas_lang';
    this.currentLang = this.getStoredLanguage();
    this.numberFormatters = {
      es: new Intl.NumberFormat('es-ES'),
      en: new Intl.NumberFormat('en-US')
    };
  }

  getStoredLanguage() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      if (saved && (saved === 'es' || saved === 'en')) {
        return saved;
      }
    } catch (e) {
      console.warn('localStorage not available for i18n:', e);
    }
    return 'es'; // 'es' por defecto según requisito
  }

  getLang() {
    return this.currentLang;
  }

  t(key, params = {}) {
    const dict = translations[this.currentLang] || translations.es;
    let str = dict[key] || translations.es[key] || key;

    // Sustitución de plantillas con {{variable}}
    if (typeof str === 'string') {
      str = str.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, varName) => {
        if (params[varName] !== undefined) {
          const val = params[varName];
          if (typeof val === 'number') {
            return this.formatNumber(val);
          }
          return val;
        }
        return '';
      });
    }
    return str;
  }

  formatNumber(val) {
    const formatter = this.numberFormatters[this.currentLang] || this.numberFormatters.es;
    return formatter.format(val);
  }

  setLanguage(newLang) {
    if (newLang !== 'es' && newLang !== 'en') return;
    this.currentLang = newLang;
    try {
      localStorage.setItem(this.storageKey, newLang);
    } catch (e) {
      console.warn('Could not save language to localStorage:', e);
    }

    // Actualiza el atributo lang del HTML
    document.documentElement.lang = newLang;

    // Aplica animación de transición suave
    this.applyTransitionsAndUpdateDOM();

    // Notifica a otros componentes
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang: newLang } }));
  }

  applyTransitionsAndUpdateDOM() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const transElements = document.querySelectorAll('[data-i18n], [data-i18n-placeholder], [data-i18n-title], [data-i18n-aria], [data-i18n-html]');

    if (prefersReducedMotion) {
      this.updateDOMTexts();
      this.updateLanguageButtons();
      return;
    }

    // Añadir clase de transición de fade y leve deslizamiento (250 ms)
    transElements.forEach(el => {
      el.classList.add('i18n-fade-out');
    });

    setTimeout(() => {
      this.updateDOMTexts();
      this.updateLanguageButtons();

      transElements.forEach(el => {
        el.classList.remove('i18n-fade-out');
        el.classList.add('i18n-fade-in');
      });

      setTimeout(() => {
        transElements.forEach(el => el.classList.remove('i18n-fade-in'));
      }, 250);
    }, 130);
  }

  updateDOMTexts() {
    // 1. Textos data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (key) {
        el.textContent = this.t(key);
      }
    });

    // 2. Placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (key) {
        el.placeholder = this.t(key);
      }
    });

    // 3. Titles / Tooltips
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
      const key = el.getAttribute('data-i18n-title');
      if (key) {
        el.title = this.t(key);
      }
    });

    // 4. Aria-labels
    document.querySelectorAll('[data-i18n-aria]').forEach(el => {
      const key = el.getAttribute('data-i18n-aria');
      if (key) {
        el.setAttribute('aria-label', this.t(key));
      }
    });

    // 5. HTML interno enriquecido
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
      const key = el.getAttribute('data-i18n-html');
      if (key) {
        el.innerHTML = this.t(key);
      }
    });
  }

  updateLanguageButtons() {
    const btnEs = document.getElementById('lang-btn-es');
    const btnEn = document.getElementById('lang-btn-en');
    
    if (btnEs && btnEn) {
      const isEs = this.currentLang === 'es';
      
      // Resaltado visual del idioma activo y efecto pulso
      this.toggleButtonHighlight(btnEs, isEs);
      this.toggleButtonHighlight(btnEn, !isEs);
    }
  }

  toggleButtonHighlight(btn, isActive) {
    if (isActive) {
      btn.classList.add('active-lang', 'ring-2', 'ring-indigo-400', 'bg-indigo-600', 'text-white', 'shadow-lg');
      btn.classList.remove('bg-slate-800', 'text-slate-300', 'hover:bg-slate-700');
      btn.setAttribute('aria-pressed', 'true');
      
      // Efecto pulso en botón activado
      btn.classList.add('animate-pulse-once');
      setTimeout(() => btn.classList.remove('animate-pulse-once'), 500);
    } else {
      btn.classList.remove('active-lang', 'ring-2', 'ring-indigo-400', 'bg-indigo-600', 'text-white', 'shadow-lg');
      btn.classList.add('bg-slate-800', 'text-slate-300', 'hover:bg-slate-700');
      btn.setAttribute('aria-pressed', 'false');
    }
  }

  init() {
    document.documentElement.lang = this.currentLang;
    this.updateDOMTexts();
    this.updateLanguageButtons();

    // Eventos para los botones de idioma
    const btnEs = document.getElementById('lang-btn-es');
    const btnEn = document.getElementById('lang-btn-en');
    if (btnEs) {
      btnEs.addEventListener('click', () => this.setLanguage('es'));
    }
    if (btnEn) {
      btnEn.addEventListener('click', () => this.setLanguage('en'));
    }
  }
}

// Instancia global
window.i18n = new I18nManager();
