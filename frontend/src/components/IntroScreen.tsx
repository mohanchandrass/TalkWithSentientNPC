import React from 'react';

interface IntroScreenProps {
  onEnter: () => void;
}

export const IntroScreen: React.FC<IntroScreenProps> = ({ onEnter }) => {
  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <h1 style={styles.title}>SKYRIM NPC</h1>
        <p style={styles.subtitle}>AN EXPERIMENTAL AI DIALOGUE EXPERIENCE</p>
        <button className="rpg-button" style={styles.enterButton} onClick={onEnter}>
          ENTER THE TAVERN
        </button>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'radial-gradient(circle at center, #1a1a1a 0%, #000 100%)',
    animation: 'fadeIn 2s ease-in',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '30px',
  },
  title: {
    fontFamily: 'var(--font-display)',
    fontSize: '5rem',
    color: '#e6e6e6',
    textShadow: '0 0 20px rgba(255, 255, 255, 0.2), 0 4px 4px rgba(0,0,0,0.8)',
    letterSpacing: '10px',
    margin: 0,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: 'var(--font-body)',
    fontSize: '1.5rem',
    color: 'var(--text-muted)',
    letterSpacing: '4px',
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  enterButton: {
    marginTop: '40px',
  }
};
