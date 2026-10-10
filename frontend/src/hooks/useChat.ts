import { useState, useEffect, useRef } from 'react';
import { sendChatMessage } from '../services/api';
import { audioService } from '../services/audio';

export type ChatState = 'IDLE' | 'THINKING' | 'SPEAKING' | 'ERROR';

export interface Message {
  role: 'user' | 'npc';
  text: string;
}

export function useChat() {
  const [chatState, setChatState] = useState<ChatState>('IDLE');
  const [npcResponse, setNpcResponse] = useState<string>('');
  const [history, setHistory] = useState<Message[]>([]);
  
  const chatStateRef = useRef(chatState);
  useEffect(() => {
    chatStateRef.current = chatState;
  }, [chatState]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && chatStateRef.current === 'SPEAKING') {
        audioService.stopNpcAudio();
        setChatState('IDLE');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const submitMessage = async (message: string) => {
    if (!message.trim() || chatState === 'THINKING' || chatState === 'SPEAKING') {
      return;
    }

    setChatState('THINKING');
    setNpcResponse('');
    setHistory(prev => [...prev, { role: 'user', text: message }]);

    try {
      const response = await sendChatMessage(message);
      
      setNpcResponse(response.text);
      setHistory(prev => [...prev, { role: 'npc', text: response.text }]);
      
      if (response.audio_url) {
        setChatState('SPEAKING');
        audioService.playNpcAudio(
          response.audio_url, 
          () => {
            // Re-check state using ref to avoid overriding if already IDLE due to ESC
            if (chatStateRef.current === 'SPEAKING') {
               setChatState('IDLE');
            }
          },
          (error) => {
            console.error('Audio playback error:', error);
            setChatState('ERROR');
            setTimeout(() => {
              if (chatStateRef.current === 'ERROR') {
                setChatState('IDLE');
              }
            }, 5000);
          }
        );
      } else {
        setChatState('IDLE');
      }
    } catch (error) {
      console.error(error);
      setChatState('ERROR');
      
      // Auto-recover from error state after a few seconds so user can try again
      setTimeout(() => {
        if (chatStateRef.current === 'ERROR') {
          setChatState('IDLE');
        }
      }, 5000);
    }
  };

  return {
    chatState,
    npcResponse,
    history,
    submitMessage
  };
}
