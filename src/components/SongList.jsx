// src/components/SongList.jsx
import styles from './MainMenu.module.css';
import { useEffect, useState } from 'react';

function SongList({ onSongSelect, onBackClick }) {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetch('/api/songs')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch songs');
        return res.json();
      })
      .then((data) => {
        if (mounted) setSongs(data);
      })
      .catch((e) => {
        if (mounted) setError(e.message);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => (mounted = false);
  }, []);

  if (loading) return <div>Loading songs…</div>;
  if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;

  return (
    <div>
      <h2>All Songs</h2>
      <div className={styles.menuContainer}>
        {songs.map((song) => (
          <button
            key={song.id}
            className={styles.menuButton}
            onClick={() => onSongSelect(song.id)}
          >
            {song.title} ({song.difficulty})
          </button>
        ))}
      </div>
      <hr style={{ margin: '20px 0' }} />
      <button onClick={onBackClick}>Back to Menu</button>
    </div>
  );
}

export default SongList;