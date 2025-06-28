import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [recs, setRecs] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/recs').then(res => {
      setRecs(res.data.recommendations);
    });
  }, []);

  return (
    <div>
      <h1>StreamVista</h1>
      <ul>
        {recs.map((rec, i) => (
          <li key={i}>{rec.title} - {rec.genre}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
