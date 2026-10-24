/**
 * Modal de Pizarra Táctil (Borrador de Trabajo en Canvas)
 * Soporta lápiz a mano alzada, goma de borrar, herramienta de texto con símbolos matemáticos,
 * selector de colores, slider de grosor, deshacer/rehacer y persistencia por ejercicio.
 */

class WhiteboardModal {
  constructor() {
    this.modal = document.getElementById('whiteboard-modal');
    this.canvas = document.getElementById('wb-canvas');
    this.ctx = this.canvas ? this.canvas.getContext('2d', { willReadFrequently: true }) : null;
    
    // Tools: 'pencil' | 'eraser' | 'text'
    this.currentTool = 'pencil';
    this.currentColor = '#2563eb'; // Azul por defecto
    this.currentSize = 4; // Grosor en px
    
    // Estado de dibujo
    this.isDrawing = false;
    this.lastX = 0;
    this.lastY = 0;
    
    // Historial para Undo / Redo
    this.history = [];
    this.historyStep = -1;
    this.maxHistory = 20;

    // Herramienta de texto
    this.textCoords = null;
    this.textModal = document.getElementById('wb-text-input-dialog');
    this.textInput = document.getElementById('wb-text-field');

    // Elementos de la interfaz
    this.bannerExpr = document.getElementById('wb-banner-expression');
    this.sizeSlider = document.getElementById('wb-stroke-slider');
    this.sizePreview = document.getElementById('wb-size-indicator');
    this.btnCheck = document.getElementById('wb-btn-check');
    this.inputAnswer = document.getElementById('wb-answer-input');

    this.init();
  }

  init() {
    if (!this.canvas) return;

    this.setupEventListeners();
    this.updateColorSelection();
    this.updateToolButtons();
    this.updateSizePreview();
  }

  setupEventListeners() {
    // Redimensionamiento
    window.addEventListener('resize', () => {
      if (this.isOpen()) {
        this.resizeCanvas(true);
      }
    });

    // Puntero en Canvas (PointerEvents unificados para táctil, lápiz óptico y mouse)
    this.canvas.addEventListener('pointerdown', (e) => this.handlePointerDown(e));
    this.canvas.addEventListener('pointermove', (e) => this.handlePointerMove(e));
    this.canvas.addEventListener('pointerup', (e) => this.handlePointerUp(e));
    this.canvas.addEventListener('pointercancel', (e) => this.handlePointerUp(e));

    // Intercepción estricta de touchmove en el Canvas con { passive: false } y e.preventDefault()
    // para que el trazo del dedo no mueva la ventana bajo ninguna circunstancia en iOS PWA standalone
    this.canvas.addEventListener('touchmove', (e) => {
      e.preventDefault();
    }, { passive: false });

    // Bloqueo de gestos multitáctiles o zoom sobre el canvas
    this.canvas.addEventListener('touchstart', (e) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    }, { passive: false });

    // Bloqueo de gestos de zoom de iOS Safari en el canvas
    this.canvas.addEventListener('gesturestart', (e) => e.preventDefault(), { passive: false });
    this.canvas.addEventListener('gesturechange', (e) => e.preventDefault(), { passive: false });
    this.canvas.addEventListener('gestureend', (e) => e.preventDefault(), { passive: false });

    // Bloqueo de gestos de rebote elástico en el contenedor del modal de pizarra
    if (this.modal) {
      this.modal.addEventListener('touchmove', (e) => {
        // Permitir interacción exclusivamente en inputs editables (slider de grosor y respuesta)
        if (e.target !== this.sizeSlider && e.target !== this.inputAnswer && e.target !== this.textInput) {
          e.preventDefault();
        }
      }, { passive: false });
    }

    // Botones de herramientas
    document.getElementById('wb-tool-pencil')?.addEventListener('click', () => this.setTool('pencil'));
    document.getElementById('wb-tool-eraser')?.addEventListener('click', () => this.setTool('eraser'));
    document.getElementById('wb-tool-text')?.addEventListener('click', () => this.setTool('text'));

    // Selector de colores
    document.querySelectorAll('[data-wb-color]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const color = btn.getAttribute('data-wb-color');
        if (color) {
          this.setColor(color);
          if (this.currentTool === 'eraser') {
            this.setTool('pencil');
          }
        }
      });
    });

    // Slider de grosor
    if (this.sizeSlider) {
      this.sizeSlider.addEventListener('input', (e) => {
        this.currentSize = parseInt(e.target.value, 10) || 4;
        this.updateSizePreview();
      });
    }

    // Limpiar todo
    document.getElementById('wb-btn-clear')?.addEventListener('click', () => this.clearCanvas(true));

    // Deshacer / Rehacer
    document.getElementById('wb-btn-undo')?.addEventListener('click', () => this.undo());
    document.getElementById('wb-btn-redo')?.addEventListener('click', () => this.redo());

    // Diálogo de inserción de texto
    document.getElementById('wb-btn-insert-text')?.addEventListener('click', () => this.confirmInsertText());
    document.getElementById('wb-btn-cancel-text')?.addEventListener('click', () => this.closeTextDialog());
    
    // Botones rápidos de símbolos en diálogo de texto
    document.querySelectorAll('[data-wb-symbol]').forEach(btn => {
      btn.addEventListener('click', () => {
        const sym = btn.getAttribute('data-wb-symbol');
        if (this.textInput && sym) {
          this.textInput.value += sym;
          this.textInput.focus();
        }
      });
    });

    if (this.textInput) {
      this.textInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          this.confirmInsertText();
        } else if (e.key === 'Escape') {
          this.closeTextDialog();
        }
      });
    }

    // Modal abrir/cerrar
    document.querySelectorAll('[data-action="open-whiteboard"]').forEach(btn => {
      btn.addEventListener('click', () => this.open());
    });
    document.querySelectorAll('[data-action="close-whiteboard"]').forEach(btn => {
      btn.addEventListener('click', () => this.close());
    });

    // Sincronizar input del pie de la pizarra con el input principal
    if (this.inputAnswer) {
      this.inputAnswer.addEventListener('input', (e) => {
        const mainInput = document.getElementById('answer-input');
        if (mainInput) mainInput.value = e.target.value;
      });

      this.inputAnswer.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          window.app?.checkAnswer();
        }
      });
    }

    // Botón Comprobar Respuesta en el pie de la Pizarra
    if (this.btnCheck) {
      this.btnCheck.addEventListener('click', () => {
        window.app?.checkAnswer();
      });
    }
  }

  setBannerExpression(expr) {
    if (this.bannerExpr) {
      this.bannerExpr.textContent = `${expr} = ?`;
    }
  }

  syncAnswerFromMain(val) {
    if (this.inputAnswer) {
      this.inputAnswer.value = val;
    }
  }

  open() {
    if (!this.modal) return;
    this.modal.classList.remove('hidden');
    document.body.classList.add('overflow-hidden');

    // Sincronizar valor de la respuesta principal
    const mainInput = document.getElementById('answer-input');
    if (mainInput && this.inputAnswer) {
      this.inputAnswer.value = mainInput.value;
    }

    // Reajustar canvas después de mostrar el modal preservando el dibujo existente
    setTimeout(() => {
      this.resizeCanvas(this.historyStep >= 0);
      if (this.historyStep === -1) {
        this.saveState();
      }
    }, 50);

    window.soundSystem?.playClick();
  }

  close() {
    if (!this.modal) return;
    this.modal.classList.add('hidden');
    document.body.classList.remove('overflow-hidden');
    this.closeTextDialog();
    window.soundSystem?.playClick();
  }

  isOpen() {
    return this.modal && !this.modal.classList.contains('hidden');
  }

  resizeCanvas(preserveDrawing = true) {
    if (!this.canvas) return;
    const container = this.canvas.parentElement;
    if (!container) return;

    let savedData = null;
    if (preserveDrawing && this.canvas.width > 0 && this.canvas.height > 0) {
      savedData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    }

    const rect = container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    // Dimensiones en CSS
    this.canvas.style.width = `${rect.width}px`;
    this.canvas.style.height = `${rect.height}px`;

    // Dimensiones internas nítidas
    const newWidth = Math.floor(rect.width * dpr);
    const newHeight = Math.floor(rect.height * dpr);

    if (this.canvas.width !== newWidth || this.canvas.height !== newHeight) {
      this.canvas.width = newWidth;
      this.canvas.height = newHeight;
      this.ctx.scale(dpr, dpr);

      // Restaurar con fondo blanco limpio si teníamos dibujo previo
      this.fillBackground();
      if (savedData && preserveDrawing) {
        this.ctx.putImageData(savedData, 0, 0);
      }
    }
  }

  fillBackground() {
    if (!this.ctx) return;
    this.ctx.save();
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.fillStyle = '#ffffff';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.restore();
  }

  setTool(tool) {
    this.currentTool = tool;
    this.updateToolButtons();
    window.soundSystem?.playClick();
  }

  updateToolButtons() {
    const tools = ['pencil', 'eraser', 'text'];
    tools.forEach(t => {
      const btn = document.getElementById(`wb-tool-${t}`);
      if (btn) {
        if (this.currentTool === t) {
          btn.classList.add('bg-indigo-600', 'text-white', 'shadow-md', 'ring-2', 'ring-indigo-400');
          btn.classList.remove('bg-slate-800', 'text-slate-300', 'hover:bg-slate-700');
        } else {
          btn.classList.remove('bg-indigo-600', 'text-white', 'shadow-md', 'ring-2', 'ring-indigo-400');
          btn.classList.add('bg-slate-800', 'text-slate-300', 'hover:bg-slate-700');
        }
      }
    });

    if (this.canvas) {
      if (this.currentTool === 'pencil') {
        this.canvas.style.cursor = 'crosshair';
      } else if (this.currentTool === 'eraser') {
        this.canvas.style.cursor = 'cell';
      } else if (this.currentTool === 'text') {
        this.canvas.style.cursor = 'text';
      }
    }
  }

  setColor(color) {
    this.currentColor = color;
    this.updateColorSelection();
    this.updateSizePreview();
    window.soundSystem?.playClick();
  }

  updateColorSelection() {
    document.querySelectorAll('[data-wb-color]').forEach(btn => {
      const color = btn.getAttribute('data-wb-color');
      if (color === this.currentColor) {
        btn.classList.add('ring-4', 'ring-indigo-500', 'scale-110');
      } else {
        btn.classList.remove('ring-4', 'ring-indigo-500', 'scale-110');
      }
    });
  }

  updateSizePreview() {
    if (this.sizePreview) {
      this.sizePreview.style.width = `${Math.min(28, Math.max(4, this.currentSize))}px`;
      this.sizePreview.style.height = `${Math.min(28, Math.max(4, this.currentSize))}px`;
      this.sizePreview.style.backgroundColor = this.currentTool === 'eraser' ? '#94a3b8' : this.currentColor;
    }
  }

  getPointerPos(e) {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  }

  handlePointerDown(e) {
    if (!this.canvas) return;

    if (this.currentTool === 'text') {
      const pos = this.getPointerPos(e);
      this.openTextDialog(pos.x, pos.y);
      return;
    }

    try {
      e.preventDefault();
    } catch (err) {}

    this.isDrawing = true;
    try {
      this.canvas.setPointerCapture(e.pointerId);
    } catch (err) {}

    const pos = this.getPointerPos(e);
    this.lastX = pos.x;
    this.lastY = pos.y;

    // Punto inicial
    this.ctx.beginPath();
    this.ctx.arc(this.lastX, this.lastY, this.currentSize / 2, 0, Math.PI * 2);
    this.ctx.fillStyle = this.currentTool === 'eraser' ? '#ffffff' : this.currentColor;
    this.ctx.fill();
  }

  handlePointerMove(e) {
    if (!this.isDrawing) return;

    try {
      e.preventDefault();
    } catch (err) {}

    const pos = this.getPointerPos(e);
    const x = pos.x;
    const y = pos.y;

    this.ctx.beginPath();
    this.ctx.moveTo(this.lastX, this.lastY);
    this.ctx.lineTo(x, y);

    this.ctx.strokeStyle = this.currentTool === 'eraser' ? '#ffffff' : this.currentColor;
    this.ctx.lineWidth = this.currentTool === 'eraser' ? this.currentSize * 2.2 : this.currentSize;
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
    this.ctx.stroke();

    this.lastX = x;
    this.lastY = y;
  }

  handlePointerUp(e) {
    if (this.isDrawing) {
      this.isDrawing = false;
      try {
        this.canvas.releasePointerCapture(e.pointerId);
      } catch (err) {}
      this.saveState();
    }
  }

  openTextDialog(x, y) {
    this.textCoords = { x, y };
    if (!this.textModal) return;
    this.textModal.classList.remove('hidden');
    if (this.textInput) {
      this.textInput.value = '';
      setTimeout(() => this.textInput.focus(), 80);
    }
    window.soundSystem?.playClick();
  }

  closeTextDialog() {
    if (this.textModal) {
      this.textModal.classList.add('hidden');
    }
    this.textCoords = null;
  }

  confirmInsertText() {
    if (!this.textInput || !this.textCoords) return;
    const text = this.textInput.value.trim();
    if (text) {
      this.renderTextOnCanvas(text, this.textCoords.x, this.textCoords.y);
      this.saveState();
      window.soundSystem?.playClick();
    }
    this.closeTextDialog();
  }

  renderTextOnCanvas(text, x, y) {
    if (!this.ctx) return;
    this.ctx.save();
    
    const fontSize = Math.max(16, this.currentSize * 4.5);
    this.ctx.font = `bold ${fontSize}px system-ui, -apple-system, sans-serif`;
    this.ctx.fillStyle = this.currentColor;
    this.ctx.textBaseline = 'middle';
    
    this.ctx.fillText(text, x, y);
    this.ctx.restore();
  }

  saveState() {
    if (!this.canvas) return;
    
    // Si estábamos en medio del historial y dibujamos algo nuevo, cortamos el futuro
    if (this.historyStep < this.history.length - 1) {
      this.history = this.history.slice(0, this.historyStep + 1);
    }

    const state = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    this.history.push(state);

    if (this.history.length > this.maxHistory) {
      this.history.shift();
    } else {
      this.historyStep++;
    }

    this.updateUndoRedoButtons();
  }

  undo() {
    if (this.historyStep > 0) {
      this.historyStep--;
      const state = this.history[this.historyStep];
      this.ctx.putImageData(state, 0, 0);
      this.updateUndoRedoButtons();
      window.soundSystem?.playClick();
    }
  }

  redo() {
    if (this.historyStep < this.history.length - 1) {
      this.historyStep++;
      const state = this.history[this.historyStep];
      this.ctx.putImageData(state, 0, 0);
      this.updateUndoRedoButtons();
      window.soundSystem?.playClick();
    }
  }

  updateUndoRedoButtons() {
    const btnUndo = document.getElementById('wb-btn-undo');
    const btnRedo = document.getElementById('wb-btn-redo');

    if (btnUndo) {
      btnUndo.disabled = this.historyStep <= 0;
      btnUndo.style.opacity = this.historyStep <= 0 ? '0.4' : '1';
    }
    if (btnRedo) {
      btnRedo.disabled = this.historyStep >= this.history.length - 1;
      btnRedo.style.opacity = this.historyStep >= this.history.length - 1 ? '0.4' : '1';
    }
  }

  clearCanvas(saveToHistory = true) {
    if (!this.canvas) return;
    this.fillBackground();
    if (saveToHistory) {
      this.saveState();
      window.soundSystem?.playClick();
    }
  }

  /**
   * Resetea completamente la pizarra cuando se completa un ejercicio con éxito
   */
  resetForNewExercise() {
    this.history = [];
    this.historyStep = -1;
    this.clearCanvas(false);
    this.saveState();
  }
}

window.whiteboard = new WhiteboardModal();
