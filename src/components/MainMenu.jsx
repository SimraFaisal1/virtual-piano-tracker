import styles from './MainMenu.module.css';


//main menu navigation stuff
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

      <button className={styles.menuButton} onClick={onForumClick}>
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