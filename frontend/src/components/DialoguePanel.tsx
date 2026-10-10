import React, { useRef, useEffect } from 'react';
import type { ChatState, Message } from '../hooks/useChat';

interface DialoguePanelProps {
  chatState: ChatState;
  npcResponse: string;
  history: Message[];
}

export const DialoguePanel: React.FC<DialoguePanelProps> = ({ chatState, npcResponse, history }) => {
  let displayContent = npcResponse;
  
  if (chatState === 'THINKING') {
    displayContent = "The stranger considers your words...";
  } else if (chatState === 'ERROR' && !npcResponse) {
    displayContent = "The stranger falls silent.";
  } else if (!npcResponse && chatState === 'IDLE' && history.length === 0) {
    displayContent = "Greetings, traveler. What brings you to this place?";
  }
  
  // Ref for auto-scrolling
  const historyEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (historyEndRef.current) {
      historyEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [history, chatState]);

  // We filter out the absolute latest npc response if we are in SPEAKING or IDLE state and displaying it dominantly, 
  // but to keep it simple, we can display ALL history except the one currently generated if it's identical, 
  // actually wait, history already contains the latest response once it arrives. 
  // Let's render history and then the active interaction block.
  // We'll slice all but the last exchange for the scrollable history if the last is NPC.
  
  const historyToRender = (chatState === 'SPEAKING' || chatState === 'IDLE' || chatState === 'ERROR') && npcResponse 
    ? history.slice(0, -1) 
    : history;

  return (
    <div style={styles.container}>
      <div style={styles.historyContainer}>
        {historyToRender.map((msg, idx) => (
          <div key={idx} style={msg.role === 'user' ? styles.userHistory : styles.npcHistory}>
            <span style={styles.historyRole}>{msg.role === 'user' ? 'PLAYER' : 'MYSTERIOUS STRANGER'}</span>
            <p style={styles.historyText}>"{msg.text}"</p>
          </div>
        ))}
        <div ref={historyEndRef} />
      </div>

      <div style={styles.nameHeader}>
        <span style={styles.nameLine}></span>
        <h3 style={styles.nameText}>MYSTERIOUS STRANGER</h3>
        <span style={styles.nameLine}></span>
      </div>
      
      <div style={styles.dialogueBox}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
          <p style={{
            ...styles.text, 
            color: chatState === 'ERROR' && !npcResponse ? 'var(--text-blood)' : 
                   chatState === 'THINKING' ? 'var(--text-muted)' : 'var(--text-light)'
          }}>
            "{displayContent}"
          </p>
          {chatState === 'ERROR' && npcResponse && (
            <p style={{ ...styles.text, color: 'var(--text-blood)', fontSize: '1.1rem', fontStyle: 'italic' }}>
              The words were spoken, but the tavern could not hear them.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    width: '100%',
    maxWidth: '800px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '15px',
    maxHeight: '400px', // constrain height for scrolling history
  },
  historyContainer: {
    width: '100%',
    flex: 1,
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    padding: '0 20px',
    marginBottom: '10px',
    scrollbarWidth: 'thin',
    scrollbarColor: 'var(--iron) transparent',
  },
  userHistory: {
    alignSelf: 'flex-end',
    textAlign: 'right',
    opacity: 0.7,
    maxWidth: '80%',
  },
  npcHistory: {
    alignSelf: 'flex-start',
    textAlign: 'left',
    opacity: 0.7,
    maxWidth: '80%',
  },
  historyRole: {
    fontFamily: 'var(--font-display)',
    fontSize: '0.8rem',
    color: 'var(--iron)',
    letterSpacing: '1px',
    marginBottom: '4px',
    display: 'block',
  },
  historyText: {
    fontFamily: 'var(--font-body)',
    fontSize: '1.1rem',
    color: 'var(--text-muted)',
    margin: 0,
    fontStyle: 'italic',
  },
  nameHeader: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    gap: '15px',
    marginTop: 'auto', // pushes dialogue box to bottom
  },
  nameLine: {
    flex: 1,
    height: '2px',
    background: 'linear-gradient(90deg, transparent, var(--iron), transparent)',
  },
  nameText: {
    fontFamily: 'var(--font-display)',
    color: '#e6e6e6',
    fontSize: '1.2rem',
    letterSpacing: '2px',
    margin: 0,
    textShadow: '0 2px 4px rgba(0,0,0,0.8)',
  },
  dialogueBox: {
    width: '100%',
    background: 'linear-gradient(to bottom, rgba(30, 30, 30, 0.7), rgba(15, 15, 15, 0.8))',
    border: '1px solid var(--iron)',
    borderTop: 'none',
    borderBottom: 'none',
    padding: '20px 40px',
    minHeight: '100px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: 'inset 0 0 20px rgba(0,0,0,0.5), 0 10px 20px rgba(0,0,0,0.5)',
  },
  text: {
    fontFamily: 'var(--font-body)',
    fontSize: '1.4rem',
    textAlign: 'center',
    lineHeight: '1.6',
    margin: 0,
    textShadow: '0 2px 4px rgba(0,0,0,0.8)',
  }
};
