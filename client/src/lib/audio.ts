// Web Audio API micro-sound synthesizer with instant user-gesture unlock
class SoundFX {
  private ctx: AudioContext | null = null;
  private enabled: boolean = true;
  private isUnlocked: boolean = false;

  constructor() {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("portfolio_sound_enabled");
      this.enabled = saved !== null ? saved === "true" : true;

      // Unlock AudioContext on the very first user interaction anywhere
      const unlockAudio = () => {
        this.initContext();
        if (this.ctx && this.ctx.state === "suspended") {
          this.ctx.resume().then(() => {
            this.isUnlocked = true;
          });
        } else {
          this.isUnlocked = true;
        }
        window.removeEventListener("click", unlockAudio);
        window.removeEventListener("touchstart", unlockAudio);
        window.removeEventListener("keydown", unlockAudio);
      };

      window.addEventListener("click", unlockAudio, { once: true, passive: true });
      window.addEventListener("touchstart", unlockAudio, { once: true, passive: true });
      window.addEventListener("keydown", unlockAudio, { once: true, passive: true });
    }
  }

  private initContext() {
    if (!this.ctx && typeof window !== "undefined") {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  public toggle(): boolean {
    this.initContext();
    this.enabled = !this.enabled;
    if (typeof window !== "undefined") {
      localStorage.setItem("portfolio_sound_enabled", this.enabled.toString());
    }
    if (this.enabled) {
      this.playSwitch();
    }
    return this.enabled;
  }

  public setEnabled(val: boolean) {
    this.enabled = val;
    if (typeof window !== "undefined") {
      localStorage.setItem("portfolio_sound_enabled", val.toString());
    }
  }

  // Subtle metallic tick for hover
  public playHover() {
    if (!this.enabled) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(900, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1400, this.ctx.currentTime + 0.035);

      gain.gain.setValueAtTime(0.025, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.035);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.035);
    } catch {
      // Ignore audio failure
    }
  }

  // Crisp digital click
  public playClick() {
    if (!this.enabled) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(440, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(180, this.ctx.currentTime + 0.06);

      gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.06);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.06);
    } catch {
      // Ignore
    }
  }

  // Uplifting chime
  public playOpen() {
    if (!this.enabled) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const freqs = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      freqs.forEach((f, i) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(f, this.ctx.currentTime + i * 0.045);

        gain.gain.setValueAtTime(0.035, this.ctx.currentTime + i * 0.045);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + i * 0.045 + 0.2);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(this.ctx.currentTime + i * 0.045);
        osc.stop(this.ctx.currentTime + i * 0.045 + 0.2);
      });
    } catch {
      // Ignore
    }
  }

  // Cyber switch sound
  public playSwitch() {
    try {
      this.initContext();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(520, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1040, this.ctx.currentTime + 0.09);

      gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.09);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.09);
    } catch {
      // Ignore
    }
  }

  // Futuristic success sound
  public playSuccess() {
    if (!this.enabled) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const freqs = [523.25, 659.25, 783.99, 1046.5];
      freqs.forEach((f, i) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = "triangle";
        osc.frequency.setValueAtTime(f, this.ctx.currentTime + i * 0.06);

        gain.gain.setValueAtTime(0.04, this.ctx.currentTime + i * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + i * 0.06 + 0.25);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(this.ctx.currentTime + i * 0.06);
        osc.stop(this.ctx.currentTime + i * 0.06 + 0.25);
      });
    } catch {
      // Ignore
    }
  }
}

export const sound = new SoundFX();
