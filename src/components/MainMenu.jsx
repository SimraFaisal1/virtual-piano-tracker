import styles from './MainMenu.module.css';

/**
 * The main navigation menu for the app, it receives functions as "props" from App.jsx to tell the main app which
 * screen to navigate to when a button is clicked.
 */
function MainMenu({ onFreestyleClick, onLevelsClick, onSongsClick, onForumClick }) {
  return (
    <div className={styles.menuContainer}>
      <button 
        className={styles.menuButton} 
        onClick={onFreestyleClick}
      >
        Freestyle
      </button>

      <button 
        className={styles.menuButton} 
        onClick={onLevelsClick}
      >
        Sheet Notation
      </button>

      <button 
        className={styles.menuButton} 
      >
        Forum
      </button>

      <button 
        className={styles.menuButton} 
        onClick={onSongsClick}
      >
        Songs
      </button>
    </div>
  );
}

export default MainMenu;