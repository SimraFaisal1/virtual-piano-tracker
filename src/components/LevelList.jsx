// src/components/LevelList.jsx

import styles from './MainMenu.module.css';

function LevelList({ onBackClick, onLevelSelect }) {
  return (
    <div>
      <h2>Levels</h2>
      <div className={styles.menuContainer}>
        <button className={styles.menuButton} onClick={onLevelSelect}>
          Level 1
        </button>
        <button className={styles.menuButton} onClick={onLevelSelect}>
          Level 2
        </button>
        <button className={styles.menuButton} onClick={onLevelSelect}>
          Level 3
        </button>
      </div>
      <hr style={{margin: '20px 0'}}/>
      <button onClick={onBackClick}>Back to Menu</button>
    </div>
  );
}

export default LevelList;