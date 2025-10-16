import { useState, useEffect } from 'react';
import './App.css';

import StartScreen from './components/StartScreen';
import MainMenu from './components/MainMenu';
import LevelList from './components/LevelList';
import SheetMusicView from './components/SheetMusicView';
import SongList from './components/SongList';
import PlayerView from './components/PlayerView';
import Piano from './components/Piano';
// Future
// import ForumList from './components/ForumList';
// import PostView from './components/PostView';

function App() {
  // --- State Management ---
  const [currentView, setCurrentView] = useState('start');
  const [selectedSongId, setSelectedSongId] = useState(null);
  const [backendMsg, setBackendMsg] = useState('Connecting to backend...');

  // --- API Test (FastAPI connection) ---
  useEffect(() => {
    fetch('/api/ping')
      .then(res => {
        if (!res.ok) throw new Error('Failed to reach backend');
        return res.json();
      })
      .then(data => setBackendMsg(`Backend says: ${data.msg}`))
      .catch(() => setBackendMsg('⚠️ Backend not reachable'));
  }, []);

  // --- Navigation Handler Functions ---
  const handleStartClick = () => setCurrentView('mainMenu');
  const handleBackToMenu = () => setCurrentView('mainMenu');

  // Sheet Notation Flow
  const handleShowLevels = () => setCurrentView('levelList');
  const handleShowSheetMusic = () => setCurrentView('sheetMusic');
  const handleBackToLevels = () => setCurrentView('levelList');

  // Guided Songs Flow
  const handleShowSongList = () => setCurrentView('songList');
  const handleSongSelect = (songId) => {
    setSelectedSongId(songId);
    setCurrentView('player');
  };
  const handleBackToSongList = () => setCurrentView('songList');
  
  // Freestyle Flow
  const handleShowFreestyle = () => setCurrentView('freestyle');

  // Forum Flow (for the future)
  // const handleShowForum = () => setCurrentView('forumList');

  return (
    <div className="App">
      {/* --- Conditional Rendering Block --- */}

      {currentView === 'start' && <StartScreen onStartClick={handleStartClick} />}

      {currentView === 'mainMenu' && (
        <MainMenu
          onLevelsClick={handleShowLevels}
          onSongsClick={handleShowSongList}
          onFreestyleClick={handleShowFreestyle}
          // onForumClick={handleShowForum} 
        />
      )}

      {/* Sheet Notation Views */}
      {currentView === 'levelList' && (
        <LevelList onBackClick={handleBackToMenu} onLevelSelect={handleShowSheetMusic} />
      )}
      {currentView === 'sheetMusic' && <SheetMusicView onBackClick={handleBackToLevels} />}

      {/* Guided Songs Views */}
      {currentView === 'songList' && (
        <SongList onBackClick={handleBackToMenu} onSongSelect={handleSongSelect} />
      )}
      {currentView === 'player' && (
        <PlayerView songId={selectedSongId} onBackClick={handleBackToSongList} />
      )}
      
      {/* Freestyle View */}
      {currentView === 'freestyle' && <Piano onBackClick={handleBackToMenu} />}

      {/* Forum Views (for the future) */}
      {/* {currentView === 'forumList' && <ForumList onBackClick={handleBackToMenu} />} */}

      {/* --- Backend Connection Status --- */}
      <div style={{ position: 'fixed', bottom: 10, right: 20, fontSize: '0.9rem', opacity: 0.7 }}>
        {backendMsg}
      </div>
    </div>
  );
}

export default App;