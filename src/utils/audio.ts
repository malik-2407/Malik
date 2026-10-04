// Synthesized tactical sound effects using browser Web Audio API with Master Volume Control
class SoundManager {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private volume: number = 0.8; // 0.0 to 1.0 (defaults to 80%)
  private masterGain: GainNode | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        const savedMuted = localStorage.getItem('valorant_muted');
        if (savedMuted !== null) {
          this.isMuted = JSON.parse(savedMuted);
        }
        const savedVolume = localStorage.getItem('valorant_volume');
        if (savedVolume !== null) {
          this.volume = parseFloat(savedVolume);
        }
      } catch {
        // Ignore
      }
    }
  }

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('valorant_volume', this.volume.toString());
      }
    } catch {
      // Ignore
    }

    if (this.ctx && this.masterGain) {
      const targetGain = this.isMuted ? 0 : this.volume;
      this.masterGain.gain.setValueAtTime(targetGain, this.ctx.currentTime);
    }
  }

  public getVolume(): number {
    return this.volume;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('valorant_muted', JSON.stringify(muted));
      }
    } catch {
      // Ignore
    }

    if (this.ctx && this.masterGain) {
      const targetGain = this.isMuted ? 0 : this.volume;
      this.masterGain.gain.setValueAtTime(targetGain, this.ctx.currentTime);
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  private getDestinationNode(): AudioNode {
    this.initCtx();
    return this.masterGain || this.ctx!.destination;
  }

  // Gunshot based on sound profile
  public playGunshot(profile: 'laser' | 'dark' | 'elemental' | 'heavy' | 'cyber' | 'standard' = 'standard') {
    if (this.isMuted || this.volume <= 0) return;
    this.initCtx();
    if (!this.ctx) return;

    const ctx = this.ctx;
    const dest = this.getDestinationNode();
    const now = ctx.currentTime;

    // Noise buffer for mechanical gunshot crack
    const bufferSize = ctx.sampleRate * 0.15;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.04));
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'lowpass';
    noiseFilter.frequency.setValueAtTime(profile === 'laser' || profile === 'cyber' ? 1800 : 2500, now);
    noiseFilter.frequency.exponentialRampToValueAtTime(100, now + 0.15);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.6, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(dest);
    noise.start(now);

    // Oscillator body for tonal punch
    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();

    if (profile === 'laser' || profile === 'cyber') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.18);
      oscGain.gain.setValueAtTime(0.4, now);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
    } else if (profile === 'dark') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.exponentialRampToValueAtTime(35, now + 0.25);
      oscGain.gain.setValueAtTime(0.7, now);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
    } else if (profile === 'elemental') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(540, now);
      osc.frequency.exponentialRampToValueAtTime(60, now + 0.2);
      oscGain.gain.setValueAtTime(0.5, now);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
    } else {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(45, now + 0.15);
      oscGain.gain.setValueAtTime(0.5, now);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
    }

    osc.connect(oscGain);
    oscGain.connect(dest);
    osc.start(now);
    osc.stop(now + 0.25);
  }

  // Weapon equip sound (mechanical click)
  public playEquip() {
    if (this.isMuted || this.volume <= 0) return;
    this.initCtx();
    if (!this.ctx) return;

    const ctx = this.ctx;
    const dest = this.getDestinationNode();
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

    osc.connect(gain);
    gain.connect(dest);
    osc.start(now);
    osc.stop(now + 0.1);
  }

  // Inspect flourish sound
  public playInspect() {
    if (this.isMuted || this.volume <= 0) return;
    this.initCtx();
    if (!this.ctx) return;

    const ctx = this.ctx;
    const dest = this.getDestinationNode();
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(523.25, now); // C5
    osc.frequency.setValueAtTime(659.25, now + 0.08); // E5
    osc.frequency.setValueAtTime(783.99, now + 0.16); // G5
    osc.frequency.setValueAtTime(1046.50, now + 0.24); // C6

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

    osc.connect(gain);
    gain.connect(dest);
    osc.start(now);
    osc.stop(now + 0.45);
  }

  // Reload sound
  public playReload() {
    if (this.isMuted || this.volume <= 0) return;
    this.initCtx();
    if (!this.ctx) return;

    const ctx = this.ctx;
    const dest = this.getDestinationNode();
    const now = ctx.currentTime;

    // Click 1: mag eject
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'square';
    osc1.frequency.setValueAtTime(280, now);
    osc1.frequency.exponentialRampToValueAtTime(90, now + 0.08);
    gain1.gain.setValueAtTime(0.2, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
    osc1.connect(gain1);
    gain1.connect(dest);
    osc1.start(now);
    osc1.stop(now + 0.08);

    // Click 2: mag slap in
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(140, now + 0.22);
    osc2.frequency.exponentialRampToValueAtTime(450, now + 0.3);
    gain2.gain.setValueAtTime(0.25, now + 0.22);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    osc2.connect(gain2);
    gain2.connect(dest);
    osc2.start(now + 0.22);
    osc2.stop(now + 0.35);
  }

  // Quick UI click
  public playClick() {
    if (this.isMuted || this.volume <= 0) return;
    this.initCtx();
    if (!this.ctx) return;

    const ctx = this.ctx;
    const dest = this.getDestinationNode();
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(900, now);
    osc.frequency.exponentialRampToValueAtTime(400, now + 0.04);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    osc.connect(gain);
    gain.connect(dest);
    osc.start(now);
    osc.stop(now + 0.05);
  }

  // Finisher celebration sting
  public playFinisher() {
    if (this.isMuted || this.volume <= 0) return;
    this.initCtx();
    if (!this.ctx) return;

    const ctx = this.ctx;
    const dest = this.getDestinationNode();
    const now = ctx.currentTime;

    const chordNotes = [261.63, 329.63, 392.00, 523.25]; // C major
    chordNotes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.04);
      gain.gain.setValueAtTime(0.12, now + idx * 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.65);
      osc.connect(gain);
      gain.connect(dest);
      osc.start(now + idx * 0.04);
      osc.stop(now + 0.65);
    });
  }

  // Shop purchase fanfare
  public playPurchase() {
    if (this.isMuted || this.volume <= 0) return;
    this.initCtx();
    if (!this.ctx) return;

    const ctx = this.ctx;
    const dest = this.getDestinationNode();
    const now = ctx.currentTime;

    const notes = [440, 554.37, 659.25, 880]; // A major arpeggio
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);
      gain.gain.setValueAtTime(0.2, now + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.35);
      osc.connect(gain);
      gain.connect(dest);
      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.35);
    });
  }

  // Jump takeoff sound
  public playJump() {
    if (this.isMuted || this.volume <= 0) return;
    this.initCtx();
    if (!this.ctx) return;

    const ctx = this.ctx;
    const dest = this.getDestinationNode();
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(320, now + 0.12);

    gain.gain.setValueAtTime(0.22, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    osc.connect(gain);
    gain.connect(dest);
    osc.start(now);
    osc.stop(now + 0.15);
  }

  // Land impact sound
  public playLand() {
    if (this.isMuted || this.volume <= 0) return;
    this.initCtx();
    if (!this.ctx) return;

    const ctx = this.ctx;
    const dest = this.getDestinationNode();
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.exponentialRampToValueAtTime(60, now + 0.1);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

    osc.connect(gain);
    gain.connect(dest);
    osc.start(now);
    osc.stop(now + 0.12);
  }
}

export const soundManager = new SoundManager();
