class AudioService {
  private currentAudio: HTMLAudioElement | null = null;
  private backgroundAudio: HTMLAudioElement | null = null;

  public playNpcAudio(url: string, onEnded?: () => void, onError?: (e: any) => void) {
    this.stopNpcAudio();

    this.currentAudio = new Audio(url);
    
    if (onEnded) {
      this.currentAudio.addEventListener('ended', onEnded);
    }
    if (onError) {
      this.currentAudio.addEventListener('error', onError);
    }
    
    this.currentAudio.play().catch(e => {
      console.error('Failed to play NPC audio:', e);
      if (onError) onError(e);
      else if (onEnded) onEnded();
    });
  }

  public stopNpcAudio() {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
    }
  }

  public playBackgroundMusic(url: string) {
    if (this.backgroundAudio) {
      this.backgroundAudio.pause();
    }
    this.backgroundAudio = new Audio(url);
    this.backgroundAudio.loop = true;
    this.backgroundAudio.volume = 0.4;
    this.backgroundAudio.play().catch(e => {
      console.error('Failed to play background music:', e);
    });
  }

  public fadeOutBackgroundMusic(durationMs: number = 1000) {
    if (!this.backgroundAudio) return;
    
    const audio = this.backgroundAudio;
    const startVolume = audio.volume;
    const steps = 20;
    const stepTime = durationMs / steps;
    const volumeStep = startVolume / steps;

    let currentStep = 0;

    const fadeInterval = setInterval(() => {
      currentStep++;
      if (currentStep >= steps) {
        clearInterval(fadeInterval);
        audio.pause();
        audio.currentTime = 0;
        this.backgroundAudio = null;
      } else {
        audio.volume = Math.max(0, startVolume - (volumeStep * currentStep));
      }
    }, stepTime);
  }
}

export const audioService = new AudioService();
