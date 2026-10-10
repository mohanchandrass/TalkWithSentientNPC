class SpeechService {
  private mediaStream: MediaStream | null = null;
  private audioContext: AudioContext | null = null;
  private scriptProcessor: ScriptProcessorNode | null = null;
  private source: MediaStreamAudioSourceNode | null = null;
  private audioChunks: Float32Array[] = [];
  
  async startRecording() {
    this.audioChunks = [];
    
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Microphone API not supported by browser");
    }

    this.mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    
    // We want 16kHz for Vosk
    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({
      sampleRate: 16000
    });
    
    this.source = this.audioContext.createMediaStreamSource(this.mediaStream);
    
    // 4096 buffer size, 1 input channel (mono), 1 output channel
    this.scriptProcessor = this.audioContext.createScriptProcessor(4096, 1, 1);
    
    this.scriptProcessor.onaudioprocess = (e) => {
      const inputData = e.inputBuffer.getChannelData(0);
      // We need to copy the data because the browser reuses the buffer
      this.audioChunks.push(new Float32Array(inputData));
    };
    
    this.source.connect(this.scriptProcessor);
    this.scriptProcessor.connect(this.audioContext.destination);
  }
  
  async stopRecording(): Promise<Blob | null> {
    if (!this.mediaStream || !this.audioContext) return null;
    
    // Disconnect everything
    if (this.source && this.scriptProcessor) {
      this.source.disconnect(this.scriptProcessor);
      this.scriptProcessor.disconnect(this.audioContext.destination);
    }
    
    this.mediaStream.getTracks().forEach(track => track.stop());
    
    if (this.audioContext.state !== 'closed') {
        await this.audioContext.close();
    }
    
    this.mediaStream = null;
    this.audioContext = null;
    this.scriptProcessor = null;
    this.source = null;
    
    if (this.audioChunks.length === 0) return null;
    
    // Merge chunks
    const totalLength = this.audioChunks.reduce((acc, chunk) => acc + chunk.length, 0);
    const result = new Float32Array(totalLength);
    let offset = 0;
    for (const chunk of this.audioChunks) {
      result.set(chunk, offset);
      offset += chunk.length;
    }
    
    // Create WAV
    return this.encodeWAV(result, 16000);
  }
  
  private encodeWAV(samples: Float32Array, sampleRate: number): Blob {
    const buffer = new ArrayBuffer(44 + samples.length * 2);
    const view = new DataView(buffer);
    
    /* RIFF identifier */
    this.writeString(view, 0, 'RIFF');
    /* file length */
    view.setUint32(4, 36 + samples.length * 2, true);
    /* RIFF type */
    this.writeString(view, 8, 'WAVE');
    /* format chunk identifier */
    this.writeString(view, 12, 'fmt ');
    /* format chunk length */
    view.setUint32(16, 16, true);
    /* sample format (raw) */
    view.setUint16(20, 1, true);
    /* channel count */
    view.setUint16(22, 1, true);
    /* sample rate */
    view.setUint32(24, sampleRate, true);
    /* byte rate (sample rate * block align) */
    view.setUint32(28, sampleRate * 2, true);
    /* block align (channel count * bytes per sample) */
    view.setUint16(32, 2, true);
    /* bits per sample */
    view.setUint16(34, 16, true);
    /* data chunk identifier */
    this.writeString(view, 36, 'data');
    /* data chunk length */
    view.setUint32(40, samples.length * 2, true);

    // Float to 16-bit PCM
    let offset = 44;
    for (let i = 0; i < samples.length; i++, offset += 2) {
        let s = Math.max(-1, Math.min(1, samples[i]));
        view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
    }
    
    return new Blob([view], { type: 'audio/wav' });
  }
  
  private writeString(view: DataView, offset: number, string: string) {
    for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
    }
  }

  async transcribe(audioBlob: Blob): Promise<string> {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'speech.wav');

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000); // 20s timeout

    const BASE_URL = 'http://127.0.0.1:8000';
    try {
      const response = await fetch(`${BASE_URL}/api/transcribe`, {
        method: 'POST',
        body: formData,
        signal: controller.signal
      });

      if (!response.ok) {
        throw new Error(`STT error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data.text || '';
    } finally {
      clearTimeout(timeoutId);
    }
  }
}

export const speechService = new SpeechService();
