import { useState, useEffect } from 'react';
import styles from './MainMenu.module.css';

/**
 * The main navigation menu for the app, it receives functions as "props" from App.jsx to tell the main app which
 * screen to navigate to when a button is clicked.
 */

//PUT YOUR VIRTIUAL PIANI TEACHER THING FONT
function MainMenu({ onFreestyleClick, onSongsClick, onForumClick }) {
  const [animate, setAnimate] = useState(false);
  //removing sheet music view
  useEffect(() => {
    setAnimate(true);
  }, []);

  const menuOptions = [
    {
      icon: '🎹',
      title: 'Freestyle',
      description: 'Play freely on the piano',
      onClick: onFreestyleClick,
      delay: 1
    },
    {
      icon: '🎵',
      title: 'Songs',
      description: 'Practice popular songs',
      onClick: onSongsClick,
      delay: 2
    },
    {
      icon: '💬',
      title: 'Forum',
      description: 'Connect with learners',
      onClick: onForumClick,
      delay: 3
    }
  ];

  return (
    <div className={styles.menuContainer}>


      <div className={styles.header}>
        <h1 className={`${styles.title} ${animate ? styles.fadeIn : ''}`}>
          Select a Mode!
        </h1>
      </div>

      <div className={styles.buttonsGrid}>
        {menuOptions.map((option, index) => (
          <button
            key={option.title}
            className={`${styles.menuButton}  ${animate ? styles.fadeInUp : ''
              }`}
            style={{ animationDelay: `${option.delay * 0.1}s` }}
            onClick={option.onClick}
          >
            <span className={styles.buttonIcon}>{option.icon}</span>
            <span className={styles.buttonTitle}>{option.title}</span>
            <span className={styles.buttonDescription}>{option.description}</span>
            <div className={styles.buttonGlow}></div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default MainMenu;