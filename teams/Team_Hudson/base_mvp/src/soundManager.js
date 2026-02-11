/**
 * Sound manager using Web Audio API to generate a fun, Mario Kart-style background sound.
 * Upbeat, bouncy, and energetic!
 */

class SoundManager {
  constructor() {
    this.audioContext = null;
    this.gainNode = null;
    this.isPlaying = false;
    this.sequenceIndex = 0;
    this.scheduleTimeout = null;
    this.startTime = 0;
  }

  /**
   * Initialize the audio context (must be called after user interaction)
   */
  init() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
  }

  /**
   * Resume audio context if suspended (required after user interaction)
   */
  async resumeIfNeeded() {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }
  }

  /**
   * Start playing Mario Kart-style fun background sound
   */
  async startWaterSound() {
    if (!this.audioContext || this.isPlaying) return;
    
    // Ensure audio context is resumed (required for browser autoplay policies)
    await this.resumeIfNeeded();
    
    if (this.audioContext.state !== 'running') {
      console.warn('Audio context not running, sound may not play');
      return;
    }

    // Create master gain node
    this.gainNode = this.audioContext.createGain();
    const now = this.audioContext.currentTime;
    this.gainNode.gain.setValueAtTime(0.25, now);
    this.gainNode.connect(this.audioContext.destination);

    // Mario Kart-style melody: Fun, bouncy, upbeat
    const melody = [
      { freq: 523.25, duration: 0.12 }, // C5
      { freq: 659.25, duration: 0.12 }, // E5
      { freq: 783.99, duration: 0.12 }, // G5
      { freq: 659.25, duration: 0.12 }, // E5
      { freq: 523.25, duration: 0.12 }, // C5
      { freq: 440.00, duration: 0.12 }, // A4
      { freq: 493.88, duration: 0.12 }, // B4
      { freq: 523.25, duration: 0.24 }, // C5 (longer)
    ];

    const bassLine = [
      { freq: 130.81, duration: 0.24 }, // C3
      { freq: 130.81, duration: 0.24 }, // C3
      { freq: 146.83, duration: 0.24 }, // D3
      { freq: 164.81, duration: 0.24 }, // E3
    ];

    this.startTime = now + 0.1; // Small delay to ensure context is ready
    this.sequenceIndex = 0;
    this.isPlaying = true;

    const scheduleNextNote = () => {
      if (!this.isPlaying || !this.audioContext || this.audioContext.state !== 'running') {
        return;
      }

      const melodyNote = melody[this.sequenceIndex % melody.length];
      const noteStartTime = this.startTime + (this.sequenceIndex * 0.12);
      const currentAudioTime = this.audioContext.currentTime;
      
      // Only schedule if the note is in the future
      if (noteStartTime < currentAudioTime) {
        this.sequenceIndex++;
        this.scheduleTimeout = setTimeout(scheduleNextNote, 50);
        return;
      }

      // Play melody
      const osc1 = this.audioContext.createOscillator();
      const gain1 = this.audioContext.createGain();
      
      osc1.type = 'square';
      osc1.frequency.setValueAtTime(melodyNote.freq, noteStartTime);
      
      gain1.gain.setValueAtTime(0.2, noteStartTime);
      gain1.gain.exponentialRampToValueAtTime(0.01, noteStartTime + melodyNote.duration);
      
      osc1.connect(gain1);
      gain1.connect(this.gainNode);
      
      osc1.start(noteStartTime);
      osc1.stop(noteStartTime + melodyNote.duration);

      // Play bass line (every other note)
      if (this.sequenceIndex % 2 === 0) {
        const bassNote = bassLine[Math.floor(this.sequenceIndex / 2) % bassLine.length];
        const osc2 = this.audioContext.createOscillator();
        const gain2 = this.audioContext.createGain();
        
        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(bassNote.freq, noteStartTime);
        
        gain2.gain.setValueAtTime(0.25, noteStartTime);
        gain2.gain.exponentialRampToValueAtTime(0.01, noteStartTime + bassNote.duration);
        
        osc2.connect(gain2);
        gain2.connect(this.gainNode);
        
        osc2.start(noteStartTime);
        osc2.stop(noteStartTime + bassNote.duration);
      }

      // Add harmony every 4 notes
      if (this.sequenceIndex % 4 === 0) {
        const harmonyFreq = melodyNote.freq * 1.5; // Perfect fifth
        const osc3 = this.audioContext.createOscillator();
        const gain3 = this.audioContext.createGain();
        
        osc3.type = 'sine';
        osc3.frequency.setValueAtTime(harmonyFreq, noteStartTime);
        
        gain3.gain.setValueAtTime(0.12, noteStartTime);
        gain3.gain.exponentialRampToValueAtTime(0.01, noteStartTime + melodyNote.duration);
        
        osc3.connect(gain3);
        gain3.connect(this.gainNode);
        
        osc3.start(noteStartTime);
        osc3.stop(noteStartTime + melodyNote.duration);
      }

      this.sequenceIndex++;
      
      // Schedule next note
      this.scheduleTimeout = setTimeout(scheduleNextNote, 100);
    };

    // Start scheduling notes
    scheduleNextNote();
  }

  /**
   * Stop Mario Kart-style sound
   */
  stopWaterSound() {
    this.isPlaying = false;
    
    if (this.scheduleTimeout) {
      clearTimeout(this.scheduleTimeout);
      this.scheduleTimeout = null;
    }
    
    if (this.gainNode) {
      // Fade out smoothly
      this.gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
      setTimeout(() => {
        if (this.gainNode) {
          this.gainNode.disconnect();
          this.gainNode = null;
        }
      }, 150);
    }
    
    this.sequenceIndex = 0;
  }

  /**
   * Play "My Heart Will Go On" by Celine Dion when boat hits iceberg
   */
  async playMyHeartWillGoOn() {
    if (!this.audioContext) {
      this.init();
    }
    
    await this.resumeIfNeeded();
    
    if (this.audioContext.state !== 'running') {
      return;
    }

    // Stop background music first
    this.stopWaterSound();

    // "My Heart Will Go On" melody - the iconic opening phrase
    // Key of D major, simplified but recognizable version
    const melody = [
      { freq: 587.33, duration: 0.4 }, // D5
      { freq: 659.25, duration: 0.3 }, // E5
      { freq: 739.99, duration: 0.3 }, // F#5
      { freq: 659.25, duration: 0.4 }, // E5
      { freq: 587.33, duration: 0.3 }, // D5
      { freq: 554.37, duration: 0.3 }, // C#5
      { freq: 493.88, duration: 0.4 }, // B4
      { freq: 440.00, duration: 0.3 }, // A4
      { freq: 392.00, duration: 0.3 }, // G4
      { freq: 369.99, duration: 0.3 }, // F#4
      { freq: 329.63, duration: 0.4 }, // E4
      { freq: 293.66, duration: 0.5 }, // D4 (longer, dramatic)
    ];

    const startTime = this.audioContext.currentTime + 0.1;
    let currentTime = startTime;

    // Create a master gain for the song
    const songGain = this.audioContext.createGain();
    songGain.gain.setValueAtTime(0.3, startTime);
    songGain.connect(this.audioContext.destination);

    // Play each note of the melody
    melody.forEach((note, index) => {
      // Main melody with a warm, flute-like sound
      const osc1 = this.audioContext.createOscillator();
      const gain1 = this.audioContext.createGain();
      
      osc1.type = 'sine'; // Smooth, flute-like
      osc1.frequency.setValueAtTime(note.freq, currentTime);
      
      // Gentle attack and release
      gain1.gain.setValueAtTime(0, currentTime);
      gain1.gain.linearRampToValueAtTime(0.25, currentTime + 0.05);
      gain1.gain.linearRampToValueAtTime(0.2, currentTime + note.duration - 0.1);
      gain1.gain.linearRampToValueAtTime(0, currentTime + note.duration);
      
      osc1.connect(gain1);
      gain1.connect(songGain);
      
      osc1.start(currentTime);
      osc1.stop(currentTime + note.duration);

      // Add harmony (octave below) for richness
      if (index % 2 === 0) {
        const osc2 = this.audioContext.createOscillator();
        const gain2 = this.audioContext.createGain();
        
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(note.freq / 2, currentTime);
        
        gain2.gain.setValueAtTime(0, currentTime);
        gain2.gain.linearRampToValueAtTime(0.15, currentTime + 0.05);
        gain2.gain.linearRampToValueAtTime(0.1, currentTime + note.duration - 0.1);
        gain2.gain.linearRampToValueAtTime(0, currentTime + note.duration);
        
        osc2.connect(gain2);
        gain2.connect(songGain);
        
        osc2.start(currentTime);
        osc2.stop(currentTime + note.duration);
      }

      currentTime += note.duration;
    });

    // Fade out at the end
    const totalDuration = melody.reduce((sum, note) => sum + note.duration, 0);
    songGain.gain.exponentialRampToValueAtTime(0.01, startTime + totalDuration + 0.5);
  }

  /**
   * Clean up all sounds
   */
  cleanup() {
    this.stopWaterSound();
  }
}

// Export a singleton instance
export const soundManager = new SoundManager();
