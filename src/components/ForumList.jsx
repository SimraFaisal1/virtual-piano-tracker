import React from "react";

export default function ForumList({ onBackClick }) {
  return (
    <div className="view-container">
      <button className="back-button" onClick={onBackClick}>
        ← Back to Menu
      </button>

      <h1>Community Forum – Leaderboard</h1>
      <p style={{ opacity: 0.8, marginBottom: "1rem" }}>
        Leaderboard
      </p>

      <div className="leaderboard-card">
        <h2 style={{ marginBottom: "1rem" }}>Top Users</h2>
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

      <div style={{ marginTop: "2rem", opacity: 0.8 }}>
        <h2>Forum Posts</h2>
        <p>Forum posts will go here.</p>
      </div>
    </div>
  );
}
