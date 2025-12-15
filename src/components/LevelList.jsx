// src/components/LevelList.jsx

import styles from './MainMenu.module.css';

function LevelList({ onBackClick, onLevelSelect }) {
  return (
    <div className={styles.menuContainer}>
      <div className={styles.header}>
        <h2 className={styles.title}>Levels</h2>
      </div>
      <div className={styles.buttonsGrid}>
        <button className={styles.menuButton} onClick={onLevelSelect}>
          <div className={styles.buttonIcon}>⭐</div>
          <div className={styles.buttonTitle}>Level 1</div>
          <div className={styles.buttonDescription}>Beginner</div>
        </button>
        <button className={styles.menuButton} onClick={onLevelSelect}>
          <div className={styles.buttonIcon}>⭐⭐</div>
          <div className={styles.buttonTitle}>Level 2</div>
          <div className={styles.buttonDescription}>Intermediate</div>
        </button>
        <button className={styles.menuButton} onClick={onLevelSelect}>
          <div className={styles.buttonIcon}>⭐⭐⭐</div>
          <div className={styles.buttonTitle}>Level 3</div>
          <div className={styles.buttonDescription}>Advanced</div>
        </button>
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

export default LevelList;