// src/components/SongList.jsx
import styles from './MainMenu.module.css';
import { mockSongs } from '../mockData'; // Import our fake data

function SongList({ onSongSelect, onBackClick }) {
  return (
    <div>
      <h2>All Songs</h2>
      <div className={styles.menuContainer}>
        {mockSongs.map(song => (
          <button 
            key={song.id} 
            className={styles.menuButton} 
            onClick={() => onSongSelect(song.id)} // Tell App which song was clicked
          >
            {song.title} ({song.difficulty})
          </button>
        ))}
      </div>
      <hr style={{margin: '20px 0'}}/>
      <button onClick={onBackClick}>Back to Menu</button>
    </div>
  );
}

export default SongList;