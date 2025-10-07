// src/components/PlayerView.jsx
function PlayerView({ songId, onBackClick }) {
  return (
    <div>
      <h2>Now Playing Song ID: {songId}</h2>
      <p>[The song player or sheet music quiz will go here]</p>
      <button onClick={onBackClick}>Back to Song List</button>
    </div>
  );
}
export default PlayerView;