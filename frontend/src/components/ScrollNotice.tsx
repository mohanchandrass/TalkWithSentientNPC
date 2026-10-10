import React from 'react';

interface ScrollNoticeProps {
  onProceed: () => void;
}

export const ScrollNotice: React.FC<ScrollNoticeProps> = ({ onProceed }) => {
  return (
    <div style={styles.container}>
      <div style={styles.scrollWrapper}>
        <div style={styles.scrollContent}>
          <h2 style={styles.title}>Notice</h2>
          
          <div style={styles.body}>
            <p>Welcome, traveler.</p>
            <br />
            <p>You are about to converse with a small experimental Skyrim NPC chatbot.</p>
            <br />
            <p>This NPC is powered by a custom Transformer model containing approximately 2 million parameters and trained on only around 7,000 dialogue pairs.</p>
            <br />
            <p>Because of its deliberately small size and limited training data, its responses may be simple, repetitive, or occasionally unusual.</p>
            <br />
            <p>This project is created for educational and research purposes. No copyright ownership is claimed over Skyrim, its characters, assets, music, or other Bethesda intellectual property.</p>
            <br />
            <p>This project is not affiliated with or endorsed by Bethesda.</p>
          </div>
          
          <button className="rpg-button" style={styles.proceedButton} onClick={onProceed}>
            PROCEED
          </button>
        </div>
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
    background: 'rgba(0, 0, 0, 0.85)', /* Dark tavern background around the scroll */
    padding: '20px',
  },
  scrollWrapper: {
    background: 'linear-gradient(135deg, var(--parchment) 0%, var(--parchment-dark) 100%)',
    border: '8px solid var(--wood)',
    borderRadius: '4px',
    boxShadow: '0 20px 50px rgba(0,0,0,0.8), inset 0 0 60px rgba(139, 69, 19, 0.4)',
    maxWidth: '700px',
    width: '100%',
    position: 'relative',
    animation: 'fadeIn 1s ease-out',
  },
  scrollContent: {
    padding: '40px 50px',
    color: 'var(--text-dark)',
    fontFamily: 'var(--font-body)',
    fontSize: '1.2rem',
    lineHeight: '1.5',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
  },
  title: {
    fontFamily: 'var(--font-display)',
    fontSize: '2.5rem',
    marginBottom: '20px',
    color: '#3a2618',
    borderBottom: '2px solid #3a2618',
    paddingBottom: '10px',
    width: '80%',
    textTransform: 'uppercase',
    letterSpacing: '3px',
  },
  body: {
    textAlign: 'left',
    width: '100%',
    marginBottom: '40px',
  },
  proceedButton: {
    background: 'linear-gradient(to bottom, #3a2618, #1a0f09)',
    border: '2px solid #5c3a21',
  }
};
