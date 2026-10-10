import { useState, useRef, useEffect } from 'react';
import { speechService } from '../services/speech';

export type SpeechState = 'IDLE' | 'LISTENING' | 'TRANSCRIBING' | 'ERROR';

export function useSpeechRecognition() {
  const [speechState, setSpeechState] = useState<SpeechState>('IDLE');
  const [speechErrorMsg, setSpeechErrorMsg] = useState<string>('');
  
  const timerRef = useRef<number | null>(null);

  const startListening = async () => {
    if (speechState !== 'IDLE') return;

    try {
      setSpeechErrorMsg('');
      await speechService.startRecording();
      setSpeechState('LISTENING');
      
      // Enforce 15-second maximum recording time
      timerRef.current = window.setTimeout(() => {
        stopListening().catch(console.error);
      }, 15000);
      
    } catch (e) {
      console.error("Microphone permission error:", e);
      setSpeechState('ERROR');
      setSpeechErrorMsg("The tavern's ears are silent. (Microphone permission denied)");
      
      // Auto-recover visual state
      setTimeout(() => setSpeechState('IDLE'), 4000);
    }
  };

  const stopListening = async (): Promise<string> => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    
    // Only transcribe if we were actively listening
    if (speechState !== 'LISTENING') return '';

    setSpeechState('TRANSCRIBING');
    
    try {
      const blob = await speechService.stopRecording();
      if (!blob) {
        setSpeechState('IDLE');
        setSpeechErrorMsg('The tavern heard nothing.');
        setTimeout(() => setSpeechErrorMsg(''), 3000);
        return '';
      }
      
      const transcript = await speechService.transcribe(blob);
      setSpeechState('IDLE');
      
      if (!transcript) {
        setSpeechErrorMsg('The tavern heard nothing.');
        setTimeout(() => setSpeechErrorMsg(''), 3000);
      }
      return transcript;
      
    } catch (e) {
      console.error("Transcription error:", e);
      setSpeechState('ERROR');
      setSpeechErrorMsg('The tavern could not understand your words.');
      await speechService.stopRecording(); // ensure cleanup on error
      setTimeout(() => setSpeechState('IDLE'), 4000);
      return '';
    }
  };
  
  const cancelListening = () => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    speechService.stopRecording();
    setSpeechState('IDLE');
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cancelListening();
    };
  }, []);

  return {
    speechState,
    speechErrorMsg,
    startListening,
    stopListening,
    cancelListening
  };
}
