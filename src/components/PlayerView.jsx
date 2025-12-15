// src/components/PlayerView.jsx
import styles from './MainMenu.module.css';

function PlayerView({ songId, onBackClick }) {
  return (
    <div className={styles.menuContainer}>
      <div className={styles.header}>
        <h2 className={styles.title}>Now Playing</h2>
        <p style={{ color: '#ffd700', fontSize: '1.2rem', marginTop: '1rem' }}>Song ID: {songId}</p>
      </div>
      <div style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        border: '2px solid rgba(255, 255, 255, 0.2)',
        borderRadius: '24px',
        padding: '3rem',
        maxWidth: '600px',
        color: 'white',
        fontSize: '1.1rem'
      }}>
        <p>[The song player or sheet music quiz will go here]</p>
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
        ← Back to Song List
      </button>
    </div>
  );
}
export default PlayerView;