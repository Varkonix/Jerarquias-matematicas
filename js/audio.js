/**
 * Sistema de Sonido sintetizado con Web Audio API (100% Offline, sin archivos externos)
 */

class SoundSystem {
  constructor() {
    this.storageKey = 'math_pemdas_sound';
    this.enabled = this.getStoredSoundState();
    this.ctx = null;
  }

  getStoredSoundState() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      return saved !== null ? saved === 'true' : true;
    } catch (e) {
      return true;
    }
  }

  setSoundEnabled(enabled) {
    this.enabled = enabled;
    try {
      localStorage.setItem(this.storageKey, enabled.toString());
    } catch (e) {
      console.warn('Could not save sound preference:', e);
    }
  }

  initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playClick() {
    if (!this.enabled) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.05);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.05);
    } catch (e) {
      // Ignorar fallos de audio menores
    }
  }

  playCorrect() {
    if (!this.enabled) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 (Arpegio Mayor)
      const now = this.ctx.currentTime;

      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const startTime = now + idx * 0.08;
        const duration = 0.28;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.2, startTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + duration);
      });
    } catch (e) {
      // Ignorar
    }
  }

  playError() {
    if (!this.enabled) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.linearRampToValueAtTime(130, now + 0.22);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.22);
    } catch (e) {
      // Ignorar
    }
  }

  playStreak() {
    if (!this.enabled) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      // Fanfarria brillante
      const chords = [
        { freqs: [440, 554.37, 659.25], time: 0 },
        { freqs: [523.25, 659.25, 783.99], time: 0.12 },
        { freqs: [587.33, 739.99, 880.00], time: 0.24 },
        { freqs: [659.25, 830.61, 987.77, 1318.51], time: 0.38 }
      ];

      const now = this.ctx.currentTime;
      chords.forEach(chord => {
        chord.freqs.forEach(freq => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          const st = now + chord.time;
          const dur = 0.35;

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, st);

          gain.gain.setValueAtTime(0.08, st);
          gain.gain.exponentialRampToValueAtTime(0.001, st + dur);

          osc.connect(gain);
          gain.connect(this.ctx.destination);

          osc.start(st);
          osc.stop(st + dur);
        });
      });
    } catch (e) {
      // Ignorar
    }
  }
}

window.soundSystem = new SoundSystem();
