// src/components/SheetMusicView.jsx

function SheetMusicView({ onBackClick }) {
  return (
    <div>
      <h2>Song Name (Placeholder)</h2>
      <p>[Sheet music will go here]</p>
      <button onClick={onBackClick}>Back to Levels</button>
    </div>
  );
}

export default SheetMusicView;