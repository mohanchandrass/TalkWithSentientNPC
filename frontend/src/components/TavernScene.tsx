import React from 'react';
import { NPCPortrait } from './NPCPortrait';
import { DialoguePanel } from './DialoguePanel';
import { DialogueInput } from './DialogueInput';
import { useChat } from '../hooks/useChat';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';

export const TavernScene: React.FC = () => {
  const { chatState, npcResponse, history, submitMessage } = useChat();
  const speechProps = useSpeechRecognition();

  return (
    <div style={styles.container}>
      <div style={styles.sceneWrapper}>
        <div style={styles.portraitSection}>
          <NPCPortrait 
            chatState={chatState} 
            isListening={speechProps.speechState === 'LISTENING'} 
          />
        </div>
        
        <div style={styles.dialogueSection}>
          <DialoguePanel chatState={chatState} npcResponse={npcResponse} history={history} />
          <DialogueInput 
            chatState={chatState} 
            onSubmit={submitMessage} 
            speechProps={speechProps}
          />
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    width: '100%',
    height: '100%',
    background: 'radial-gradient(circle at center 30%, #2b1b11 0%, #0a0502 80%, #000 100%)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    animation: 'fadeIn 1.5s ease-in',
    overflow: 'hidden',
  },
  sceneWrapper: {
    width: '100%',
    height: '100%',
    maxWidth: '1200px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: '40px 20px',
  },
  portraitSection: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '0', /* Allows flex shrinking properly */
  },
  dialogueSection: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginTop: 'auto',
  }
};
