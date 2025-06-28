import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [recs, setRecs] = useState([]);
  const [history, setHistory] = useState([]);
  const userId = "aditya123"; // Hardcoded for now (can connect to login later)

  useEffect(() => {
    // Fetch recommendations
    axios
      .get("http://localhost:5000/api/recs")
      .then((res) => setRecs(res.data.recommendations));

    // Fetch watch history for the user
    axios
      .get("http://localhost:5000/api/history", {
        params: { userId },
      })
      .then((res) => {
        if (res.data.success) {
          setHistory(res.data.history);
        }
      });
  }, []);

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h1>🎬 StreamVista</h1>

      <h2>📽 Recommended for You</h2>
      <ul>
        {recs.map((rec, index) => (
          <li key={index}>
            <strong>{rec.title}</strong> — <em>{rec.genre}</em>
          </li>
        ))}
      </ul>

      <hr />

      <h2>📜 Your Watch History</h2>
      {history.length === 0 ? (
        <p>No history yet.</p>
      ) : (
        <ul>
          {history.map((item, index) => (
            <li key={index}>
              <strong>{item.movieTitle}</strong> — {item.genre} <br />
              <small>
                Watched on: {new Date(item.watchedAt).toLocaleDateString()}
              </small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
