import React from 'react';
import type { ChatState } from '../hooks/useChat';

interface NPCPortraitProps {
  chatState: ChatState;
  isListening: boolean;
}

export const NPCPortrait: React.FC<NPCPortraitProps> = ({ chatState, isListening }) => {
  const isSpeaking = chatState === 'SPEAKING';
  const isThinking = chatState === 'THINKING';

  return (
    <div style={styles.container}>
      <div style={{ 
        ...styles.frame, 
        ...(isSpeaking ? styles.speakingGlow : {}),
        ...(isListening ? styles.listeningGlow : {}),
      }}>
        <img 
          src="/assets/npc_image.jpeg" 
          alt="Skyrim NPC" 
          style={{
            ...styles.image,
            ...(isThinking ? styles.thinkingFilter : {})
          }} 
        />
        <div style={styles.vignette}></div>
        {isListening && <div style={styles.listeningIndicator} />}
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    padding: '20px',
  },
  frame: {
    position: 'relative',
    width: '100%',
    maxWidth: '450px',
    aspectRatio: '1 / 1',
    border: '4px solid var(--wood-dark)',
    borderRadius: '4px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.8), inset 0 0 20px rgba(0,0,0,0.8)',
    overflow: 'hidden',
    transition: 'box-shadow 0.3s ease',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
    transition: 'filter 0.5s ease',
  },
  thinkingFilter: {
    filter: 'brightness(0.7) contrast(1.1) grayscale(0.2)',
  },
  vignette: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'radial-gradient(circle, rgba(0,0,0,0) 40%, rgba(0,0,0,0.8) 100%)',
    pointerEvents: 'none',
  },
  speakingGlow: {
    boxShadow: '0 0 40px rgba(200, 150, 100, 0.4), inset 0 0 20px rgba(0,0,0,0.8)',
    borderColor: '#8b5a2b',
  },
  listeningGlow: {
    boxShadow: '0 0 30px rgba(100, 150, 255, 0.3), inset 0 0 20px rgba(0,0,0,0.8)',
    borderColor: '#4a708b',
  },
  listeningIndicator: {
    position: 'absolute',
    bottom: '10px',
    right: '10px',
    width: '15px',
    height: '15px',
    borderRadius: '50%',
    backgroundColor: '#7ec0ee',
    boxShadow: '0 0 10px #7ec0ee',
    animation: 'pulse 1.5s infinite',
  }
};
