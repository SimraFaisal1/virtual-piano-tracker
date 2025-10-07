// src/components/Piano.jsx
import './Piano.css'; // We'll create this CSS file next

function Piano({ onBackClick }) {
  const playNote = (note) => {
    // Future this will play a sound
    console.log(`Played note: ${note}`);
  }

  return (
    /* Just for visuals right now, might just runthe Python script over this for the piano*/
    <div>
      <h2>Freestyle Piano</h2>
      <div className="piano-container">
        {/* White Keys */}
        <div className="white-key" onClick={() => playNote('C4')}></div>
        <div className="white-key" onClick={() => playNote('D4')}></div>
        <div className="white-key" onClick={() => playNote('E4')}></div>
      </div>
      <button onClick={onBackClick}>Back to Menu</button>
    </div>
  );
}
export default Piano;