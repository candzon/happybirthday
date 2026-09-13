export interface SongNote {
  note: string;
  dur: number;
  lyric: string;
}

export const birthdaySong: SongNote[] = [
  { note: "C4", dur: 0.35, lyric: "Lo-" },
  { note: "C4", dur: 0.15, lyric: "rem" },
  { note: "D4", dur: 0.5, lyric: "ipsum" },
  { note: "C4", dur: 0.5, lyric: "dolor" },
  { note: "F4", dur: 0.5, lyric: "sit" },
  { note: "E4", dur: 1.0, lyric: "amet~ 💖" },
  { note: "REST", dur: 0.3, lyric: "" },

  { note: "C4", dur: 0.35, lyric: "Lo-" },
  { note: "C4", dur: 0.15, lyric: "rem" },
  { note: "D4", dur: 0.5, lyric: "ipsum" },
  { note: "C4", dur: 0.5, lyric: "dolor" },
  { note: "G4", dur: 0.5, lyric: "sit" },
  { note: "F4", dur: 1.0, lyric: "amet~ ✨" },
  { note: "REST", dur: 0.3, lyric: "" },

  { note: "C4", dur: 0.35, lyric: "Lo-" },
  { note: "C4", dur: 0.15, lyric: "rem" },
  { note: "C5", dur: 0.5, lyric: "ipsum" },
  { note: "A4", dur: 0.5, lyric: "dolor" },
  { note: "F4", dur: 0.5, lyric: "sit" },
  { note: "E4", dur: 0.5, lyric: "a-" },
  { note: "D4", dur: 1.0, lyric: "met~ 👑" },
  { note: "REST", dur: 0.3, lyric: "" },

  { note: "Bb4", dur: 0.35, lyric: "Lo-" },
  { note: "Bb4", dur: 0.15, lyric: "rem" },
  { note: "A4", dur: 0.5, lyric: "ipsum" },
  { note: "F4", dur: 0.5, lyric: "dolor" },
  { note: "G4", dur: 0.5, lyric: "sit" },
  { note: "F4", dur: 1.2, lyric: "amet!!! 🎂" },
  { note: "REST", dur: 1.0, lyric: "" },
];

const noteFreqs: Record<string, number> = {
  C4: 261.63,
  D4: 293.66,
  E4: 329.63,
  F4: 349.23,
  G4: 392.00,
  A4: 440.00,
  Bb4: 466.16,
  C5: 523.25,
  REST: 0,
};

export class BirthdayAudioPlayer {
  private ctx: AudioContext | null = null;
  private isPlayingActive: boolean = false;
  private currentTimeoutIds: number[] = [];
  private onNoteCallback: ((index: number) => void) | null = null;
  private onFinishedCallback: (() => void) | null = null;

  public setCallbacks(
    onNote: (index: number) => void,
    onFinished: () => void
  ) {
    this.onNoteCallback = onNote;
    this.onFinishedCallback = onFinished;
  }

  public async start() {
    if (this.isPlayingActive) return;
    this.isPlayingActive = true;

    // Initialize AudioContext
    const AudioCtxClass = getAudioContextClass();
    if (!AudioCtxClass) {
      console.warn("Web Audio API not supported in this browser.");
      return;
    }

    this.ctx = new AudioCtxClass();
    if (this.ctx.state === "suspended") {
      await this.ctx.resume();
    }

    this.playLoop();
  }

  private playLoop() {
    if (!this.isPlayingActive || !this.ctx) return;

    let timeAccumulator = this.ctx.currentTime + 0.1;

    birthdaySong.forEach((songNote, index) => {
      if (!this.isPlayingActive || !this.ctx) return;

      const freq = noteFreqs[songNote.note] || 0;
      const duration = songNote.dur;

      // Schedule the audio note
      this.playChime(freq, timeAccumulator, duration);

      // Schedule the UI lyric update callback
      const msDelay = (timeAccumulator - this.ctx.currentTime) * 1000;
      const tid = window.setTimeout(() => {
        if (this.onNoteCallback && this.isPlayingActive) {
          this.onNoteCallback(index);
        }
      }, msDelay);
      this.currentTimeoutIds.push(tid);

      timeAccumulator += duration;
    });

    // Schedule repeat or stop callback
    const totalMsDelay = (timeAccumulator - this.ctx.currentTime) * 1000;
    const endTid = window.setTimeout(() => {
      if (this.isPlayingActive) {
        // Restart the loop
        this.playLoop();
      } else if (this.onFinishedCallback) {
        this.onFinishedCallback();
      }
    }, totalMsDelay);
    this.currentTimeoutIds.push(endTid);
  }

  private playChime(frequency: number, startTime: number, duration: number) {
    if (frequency === 0 || !this.ctx) return;

    // Primary bell tone (triangle oscillator for sweet warmth)
    const osc1 = this.ctx.createOscillator();
    const gain1 = this.ctx.createGain();
    osc1.type = "triangle";
    osc1.frequency.setValueAtTime(frequency, startTime);

    // Chime overtone (sine oscillator at octave 2 for a bell chime effect)
    const osc2 = this.ctx.createOscillator();
    const gain2 = this.ctx.createGain();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(frequency * 2, startTime);

    // Add vibrato/tremolo for extra musical sweet character
    const vibrato = this.ctx.createOscillator();
    const vibratoGain = this.ctx.createGain();
    vibrato.frequency.value = 6; // 6 Hz vibrato
    vibratoGain.gain.value = 4;  // vibrato depth in Hz
    vibrato.connect(vibratoGain);
    vibratoGain.connect(osc1.frequency); // modulating osc1 frequency

    // Attack-Decay-Release envelope (instant attack, exponential decay)
    const attack = 0.02;
    const decay = duration - 0.05;

    gain1.gain.setValueAtTime(0, startTime);
    gain1.gain.linearRampToValueAtTime(0.2, startTime + attack);
    gain1.gain.exponentialRampToValueAtTime(0.001, startTime + attack + decay);

    gain2.gain.setValueAtTime(0, startTime);
    gain2.gain.linearRampToValueAtTime(0.08, startTime + attack);
    gain2.gain.exponentialRampToValueAtTime(0.001, startTime + attack + decay);

    osc1.connect(gain1);
    gain1.connect(this.ctx.destination);

    osc2.connect(gain2);
    gain2.connect(this.ctx.destination);

    vibrato.start(startTime);
    vibrato.stop(startTime + duration);

    osc1.start(startTime);
    osc1.stop(startTime + duration);

    osc2.start(startTime);
    osc2.stop(startTime + duration);
  }

  public stop() {
    this.isPlayingActive = false;
    this.currentTimeoutIds.forEach((id) => window.clearTimeout(id));
    this.currentTimeoutIds = [];
    if (this.ctx) {
      this.ctx.close();
      this.ctx = null;
    }
    if (this.onFinishedCallback) {
      this.onFinishedCallback();
    }
  }

}

export function getAudioContextClass() {
  return window.AudioContext ?? (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
}

export function playBlowSound() {
  try {
    const AudioContextClass = getAudioContextClass();
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    const bufferSize = ctx.sampleRate * 0.45; // ~0.45 seconds of sound
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    
    // Fill buffer with white noise
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noiseNode = ctx.createBufferSource();
    noiseNode.buffer = buffer;

    // Filter to shape whoosh
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(650, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(140, ctx.currentTime + 0.4);

    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.25, ctx.currentTime + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.43);

    noiseNode.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    noiseNode.start();
    noiseNode.stop(ctx.currentTime + 0.45);

    setTimeout(() => {
      ctx.close();
    }, 500);
  } catch (e) {
    console.warn("Failed to play blow sound", e);
  }
}
