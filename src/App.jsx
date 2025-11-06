import { useState, useEffect } from 'react';
import './App.css';

import StartScreen from './components/StartScreen';
import MainMenu from './components/MainMenu';
import LevelList from './components/LevelList';
import SheetMusicView from './components/SheetMusicView';
import SongList from './components/SongList';
import PlayerView from './components/PlayerView';
import Piano from './components/Piano';
import FreestyleView from "./components/FreestyleView";

// import ForumList from './components/ForumList';
// import PostView from './components/PostView';

function App() {
  //State Management
  const [currentView, setCurrentView] = useState('start');
  const [selectedSongId, setSelectedSongId] = useState(null);
  const [backendMsg, setBackendMsg] = useState('Connecting to backend...');

  //api test (not needed anymore)
  useEffect(() => {
    fetch('/api/ping')
      .then(res => {
        if (!res.ok) throw new Error('Failed to reach backend');
        return res.json();
      })
      .then(data => setBackendMsg(`Backend says: ${data.msg}`))
      .catch(() => setBackendMsg('⚠️ Backend not reachable'));
  }, []);

  // navigation handler functions
  const handleStartClick = () => setCurrentView('mainMenu');
  const handleBackToMenu = () => setCurrentView('mainMenu');

  // sheet notation flow
  const handleShowLevels = () => setCurrentView('levelList');
  const handleShowSheetMusic = () => setCurrentView('sheetMusic');
  const handleBackToLevels = () => setCurrentView('levelList');

  //guided songs flow
  const handleShowSongList = () => setCurrentView('songList');
  const handleSongSelect = (songId) => {
    setSelectedSongId(songId);
    setCurrentView('player');
  };
  const handleBackToSongList = () => setCurrentView('songList');
  
  //Freestyle Flow
  const handleShowFreestyle = () => setCurrentView('freestyle');

  //forum flow (for the future)
  //const handleShowForum = () => setCurrentView('forumList');

  return (
    <div className="App">
      {/*  */}

      {currentView === 'start' && <StartScreen onStartClick={handleStartClick} />}

      {currentView === 'mainMenu' && (
        <MainMenu
          onLevelsClick={handleShowLevels}
          onSongsClick={handleShowSongList}
          onFreestyleClick={handleShowFreestyle}
          //onForumClick={handleShowForum} 
        />
      )}

      {/* sheet notation view */}
      {currentView === 'levelList' && (
        <LevelList onBackClick={handleBackToMenu} onLevelSelect={handleShowSheetMusic} />
      )}
      {currentView === 'sheetMusic' && <SheetMusicView onBackClick={handleBackToLevels} />}

      {/* song guide view */}
      {currentView === 'songList' && (
        <SongList onBackClick={handleBackToMenu} onSongSelect={handleSongSelect} />
      )}
      {currentView === 'player' && (
        <PlayerView songId={selectedSongId} onBackClick={handleBackToSongList} />
      )}
      
      {/* freestyle view */}
      {currentView === 'freestyle' && <FreestyleView onBackClick={handleBackToMenu} />}

      {/* placeholder for forum view (IMPLEMENT THIS LATER!!!) */}
      {/* {currentView === 'forumList' && <ForumList onBackClick={handleBackToMenu} />} */}

      {/*backend connection status*/}
      <div style={{ position: 'fixed', bottom: 10, right: 20, fontSize: '0.9rem', opacity: 0.7 }}>
        {backendMsg}
      </div>
    </div>
  );
}

export default App;

//to run this just run the uvicorn command and then npm run dev in separate terminals