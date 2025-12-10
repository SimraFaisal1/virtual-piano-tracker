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

  if (loading) return <div className={styles.menuContainer}><h2 style={{ color: '#ffd700' }}>Loading songs…</h2></div>;
  if (error) return <div className={styles.menuContainer}><h2 style={{ color: '#ff6b6b' }}>Error: {error}</h2></div>;

  return (
    <div className={styles.menuContainer}>
      <div className={styles.header}>
        <h2 className={styles.title}>All Songs</h2>
      </div>
      <div className={styles.buttonsGrid}>
        {songs.map((song) => (
          <button
            key={song.id}
            className={styles.menuButton}
            onClick={() => onSongSelect(song.id)}
          >
            <div className={styles.buttonIcon}>🎵</div>
            <div className={styles.buttonTitle}>{song.title}</div>
            <div className={styles.buttonDescription}>Difficulty: {song.difficulty}</div>
          </button>
        ))}
      </div>
      <button
        onClick={onBackClick}
        style={{
          marginTop: '2rem',
          padding: '1rem 2rem',
          background: 'rgba(255, 255, 255, 0.1)',
          border: '2px solid rgba(212, 175, 55, 0.5)',
          borderRadius: '12px',
          color: '#ffd700',
          cursor: 'pointer',
          fontSize: '1rem',
          fontWeight: '600',
          transition: 'all 0.3s'
        }}
        onMouseOver={(e) => {
          e.target.style.background = 'rgba(255, 255, 255, 0.2)';
          e.target.style.borderColor = '#ffd700';
        }}
        onMouseOut={(e) => {
          e.target.style.background = 'rgba(255, 255, 255, 0.1)';
          e.target.style.borderColor = 'rgba(212, 175, 55, 0.5)';
        }}
      >
        ← Back to Menu
      </button>
    </div>
  );
}

export default SongList;