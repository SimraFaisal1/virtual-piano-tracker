// src/components/StartScreen.jsx

function StartScreen({ onStartClick }) {
  return (
    <div>
      <h1>Virtual Piano</h1> {/*Put our app name here */}
      <button onClick={onStartClick}>Start</button>
    </div>
  );
}

export default StartScreen;