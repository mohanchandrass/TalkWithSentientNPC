import React, { useState, useEffect } from 'react';
import type { ChatState } from '../hooks/useChat';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';

interface DialogueInputProps {
  chatState: ChatState;
  onSubmit: (message: string) => void;
  speechProps: ReturnType<typeof useSpeechRecognition>;
}

export const DialogueInput: React.FC<DialogueInputProps> = ({ chatState, onSubmit, speechProps }) => {
  const [inputValue, setInputValue] = useState('');
  const [localError, setLocalError] = useState('');

  const {
    speechState,
    speechErrorMsg,
    startListening,
    stopListening,
    cancelListening
  } = speechProps;

  const isBusy = chatState === 'THINKING' || chatState === 'SPEAKING' || speechState === 'TRANSCRIBING';

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!inputValue.trim()) {
      setLocalError("Speak your words, traveler.");
      setTimeout(() => setLocalError(''), 3000);
      return;
    }

    if (!isBusy && speechState !== 'LISTENING') {
      onSubmit(inputValue);
      setInputValue('');
      setLocalError('');
    }
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    // Only respond to primary button (usually left click or touch)
    if (e.button !== 0) return;
    if (isBusy || chatState === 'SPEAKING') return;
    
    // Capture pointer so we don't lose the event if mouse moves slightly
    e.currentTarget.setPointerCapture(e.pointerId);
    startListening();
  };

  const handlePointerUp = async (e: React.PointerEvent<HTMLButtonElement>) => {
    e.currentTarget.releasePointerCapture(e.pointerId);
    if (speechState === 'LISTENING') {
      const transcript = await stopListening();
      if (transcript) {
        setInputValue(prev => {
           // Insert space if there's already text
           const prefix = prev.trim() ? prev + ' ' : '';
           return prefix + transcript;
        });
      }
    }
  };

  const handlePointerCancel = (e: React.PointerEvent<HTMLButtonElement>) => {
    e.currentTarget.releasePointerCapture(e.pointerId);
    cancelListening();
  };

  return (
    <div style={styles.container}>
      {(speechErrorMsg || localError) && (
        <div style={styles.errorMessage}>{speechErrorMsg || localError}</div>
      )}
      <form style={styles.form} onSubmit={handleSubmit}>
        <div style={styles.inputWrapper}>
          <input 
            type="text" 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isBusy}
            placeholder="Type your response..."
            style={styles.input}
          />
        </div>
        
        <div style={styles.buttonGroup}>
          <button 
            type="submit" 
            disabled={isBusy || !inputValue.trim()} 
            className="rpg-button"
            style={styles.submitBtn}
          >
            SPEAK
          </button>
          
          <button 
            type="button" 
            disabled={isBusy || chatState === 'SPEAKING'} 
            className="rpg-button"
            style={{
               ...styles.voiceBtn, 
               ...(speechState === 'LISTENING' ? styles.voiceBtnActive : {})
            }}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerCancel}
            onPointerLeave={handlePointerCancel}
            onContextMenu={(e) => e.preventDefault()} // Prevent context menu on long press
          >
            {speechState === 'LISTENING' ? 'LISTENING...' : 
             speechState === 'TRANSCRIBING' ? 'THE TAVERN LISTENS...' : 'VOICE'}
          </button>
        </div>
      </form>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    width: '100%',
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    alignItems: 'center',
  },
  inputWrapper: {
    width: '100%',
    background: 'rgba(0,0,0,0.5)',
    border: '2px solid var(--iron)',
    borderRadius: '4px',
    padding: '5px',
    boxShadow: 'inset 0 4px 8px rgba(0,0,0,0.8)',
  },
  input: {
    width: '100%',
    background: 'transparent',
    border: 'none',
    color: 'var(--text-light)',
    fontFamily: 'var(--font-body)',
    fontSize: '1.2rem',
    padding: '10px 15px',
    outline: 'none',
  },
  buttonGroup: {
    display: 'flex',
    gap: '15px',
    width: '100%',
    justifyContent: 'center',
  },
  submitBtn: {
    flex: '1',
    maxWidth: '200px',
  },
  voiceBtn: {
    flex: '1',
    maxWidth: '200px',
    fontSize: '1rem',
    userSelect: 'none',
    touchAction: 'none' // Prevent scrolling while holding down button
  },
  voiceBtnActive: {
    background: 'linear-gradient(to bottom, #722f1c, #3b170c)',
    boxShadow: 'inset 0 0 15px rgba(255,200,100,0.3), 0 4px 6px rgba(0,0,0,0.5)',
    border: '2px solid #a3462a',
  },
  errorMessage: {
    color: 'var(--text-blood)',
    fontFamily: 'var(--font-body)',
    fontSize: '1.2rem',
    textAlign: 'center',
    marginBottom: '10px',
    animation: 'fadeIn 0.3s ease-in',
  }
};
