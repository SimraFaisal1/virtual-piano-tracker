import { useState, useEffect } from "react";
import "./StartScreen.css";

function StartScreen({ onStartClick }) {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true);
  }, []);

  const handleClick = () => {
    const button = document.querySelector(".start-button");
    button.classList.add("ripple");
    setTimeout(() => button.classList.remove("ripple"), 600);
    onStartClick();
  };


  return (
    <div className="start-screen">
      <div className="content-wrapper">
        <div className={`logo-section ${animate ? "fade-in cascade-1" : ""}`}>
          <div className="piano-icon">
            <span className="key-icon">🎹</span>
          </div>
          <h1 className="title">
            Your Virtual Piano Teacher
          </h1>
        </div>

        <button
          className={`start-button ${animate ? "fade-in cascade-2" : ""}`}
          onClick={handleClick}
        >
          <span className="button-icon">✨</span>

          <span className="button-text">Click here to start learning!</span>
          <span className="button-icon">✨</span>
        </button>

        <div className={`features ${animate ? "fade-in cascade-3" : ""}`}>
          <div className="feature">
            <span className="feature-icon">🎓</span>
            <span>Beginner Lessons</span>
          </div>
          <div className="feature">
            <span className="feature-icon">🎵</span>
            <span>Interactive Practice</span>
          </div>
          <div className="feature">
            <span className="feature-icon">💬</span>
            <span>Community Forum</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StartScreen;