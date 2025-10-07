import { useState } from 'react';
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
  // The main state to control which view is visible
  const [currentView, setCurrentView] = useState('start');

  // State to keep track of which specific item is selected
  const [selectedSongId, setSelectedSongId] = useState(null);
  // const [selectedPostId, setSelectedPostId] = useState(null); // For the forum later

  // --- Navigation Handler Functions ---

  // General Navigation
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

  // Forum Flow (example for the future)
  // const handleShowForum = () => setCurrentView('forumList');

  return (
    <div className="App">
      {/* --- Conditional Rendering Block --- */}
      {/* This block decides which component to show based on the currentView state */}

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
      {currentView === 'levelList' && <LevelList onBackClick={handleBackToMenu} onLevelSelect={handleShowSheetMusic} />}
      {currentView === 'sheetMusic' && <SheetMusicView onBackClick={handleBackToLevels} />}

      {/* Guided Songs Views */}
      {currentView === 'songList' && <SongList onBackClick={handleBackToMenu} onSongSelect={handleSongSelect} />}
      {currentView === 'player' && <PlayerView songId={selectedSongId} onBackClick={handleBackToSongList} />}
      
      {/* Freestyle View */}
      {currentView === 'freestyle' && <Piano onBackClick={handleBackToMenu} />}

      {/* Forum Views (for the future) */}
      {/* {currentView === 'forumList' && <ForumList onBackClick={handleBackToMenu} />} */}
      
    </div>
  );
}

export default App;