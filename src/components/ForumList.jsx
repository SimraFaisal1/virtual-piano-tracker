import React from "react";

export default function ForumList({ onBackClick }) {
  return (
    <div className="view-container">
      <button className="back-button" onClick={onBackClick}>
        ← Back to Menu
      </button>

      <h1 style={{ color: '#ffd700', fontSize: '3rem', textShadow: '0 4px 20px rgba(0, 0, 0, 0.3)' }}>Community Forum</h1>
      <p style={{ opacity: 0.9, marginBottom: "1rem", fontSize: '1.2rem', color: 'white' }}>
        Leaderboard
      </p>

      <div className="leaderboard-card">
        <h2 style={{ marginBottom: "1rem", color: '#ffd700' }}>Top Users</h2>
        <table className="leaderboard-table">
          <thead>
            <tr>
              <th>Placement</th>
              <th>User</th>
              <th>Score</th>
              <th>Posts</th>
              <th>Streak</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>🥇 1st</td>
              <td>jonathan</td>
              <td>1200</td>
              <td>34</td>
              <td>5 days</td>
            </tr>
            <tr>
              <td>🥈 2nd</td>
              <td>tony</td>
              <td>950</td>
              <td>20</td>
              <td>3 days</td>
            </tr>
            <tr>
              <td>🥉 3rd</td>
              <td>anthony</td>
              <td>800</td>
              <td>15</td>
              <td>1 day</td>
            </tr>
            <tr>
              <td>4th</td>
              <td>steve jobs</td>
              <td>600</td>
              <td>10</td>
              <td>0 days</td>
            </tr>
            <tr>
              <td>5th</td>
              <td>skateboarder</td>
              <td>480</td>
              <td>8</td>
              <td>0 days</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: "2rem", opacity: 0.9, background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px)', border: '2px solid rgba(255, 255, 255, 0.2)', borderRadius: '16px', padding: '2rem', maxWidth: '800px', width: '100%' }}>
        <h2 style={{ color: '#ffd700' }}>Forum Posts</h2>
        <p style={{ color: 'white' }}>Forum posts will go here.</p>
      </div>
    </div>
  );
}
