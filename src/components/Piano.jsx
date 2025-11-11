import React, { useCallback, useState } from "react";

async function playNote(note) {
  try {
    await fetch("/api/play", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ note }),
    });
  } catch (e) {
    console.error("playNote failed:", e);
  }
}

// Reusable piano key component
const Key = ({ note, label, onPlay }) => {
  const [down, setDown] = useState(false);

  const handleDown = async () => {
    setDown(true);
    await onPlay(note);
    setTimeout(() => setDown(false), 120); // temporary highlight
  };

  return (
    <div
      role="button"
      aria-label={`${label} (${note.toUpperCase()})`}
      onClick={handleDown}
      style={{
        width: 60,
        height: 180,
        background: down ? "#e6e6e6" : "white",
        border: "1px solid #333",
        boxSizing: "border-box",
        cursor: "pointer",
        userSelect: "none",
        transition: "background 0.1s",
      }}
      title={`${label} (${note.toUpperCase()})`}
    />
  );
};

export default function Piano({ onBackClick }) {
  const onPlay = useCallback((n) => playNote(n), []);

  // Notes C D E F G
  const keys = [
    { note: "c4", label: "C" },
    { note: "d4", label: "D" },
    { note: "e4", label: "E" },
    { note: "f4", label: "F" },
    { note: "g4", label: "G" },
  ];

  return (
    <div style={{ textAlign: "center" }}>
      <h2>Freestyle Piano</h2>

      <div
        style={{
          display: "inline-flex",
          gap: 2,
          marginTop: 12,
          marginBottom: 12,
        }}
      >
        {keys.map((key) => (
          <Key
            key={key.note}
            note={key.note}
            label={key.label}
            onPlay={onPlay}
          />
        ))}
      </div>

      <div>
        <button onClick={onBackClick}>Back to Menu</button>
      </div>
    </div>
  );
}