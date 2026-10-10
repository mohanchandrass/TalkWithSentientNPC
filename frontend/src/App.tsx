import React, { useState } from 'react';
import { IntroScreen } from './components/IntroScreen';
import { ScrollNotice } from './components/ScrollNotice';
import { TavernScene } from './components/TavernScene';
import { audioService } from './services/audio';

type AppState = 'INTRO' | 'SCROLL' | 'TAVERN';

function App() {
  const [appState, setAppState] = useState<AppState>('INTRO');

  const handleEnterTavern = () => {
    // Attempt to start audio here since it's the first user interaction
    audioService.playBackgroundMusic('/assets/skyrim_theme.mp3');
    setAppState('SCROLL');
  };

  const handleProceed = () => {
    // Fade out background music before transitioning to tavern
    audioService.fadeOutBackgroundMusic(1500);
    setAppState('TAVERN');
  };

  return (
    <div style={{ width: '100%', height: '100%' }}>
      {appState === 'INTRO' && <IntroScreen onEnter={handleEnterTavern} />}
      {appState === 'SCROLL' && <ScrollNotice onProceed={handleProceed} />}
      {appState === 'TAVERN' && <TavernScene />}
    </div>
  );
}

export default App;
