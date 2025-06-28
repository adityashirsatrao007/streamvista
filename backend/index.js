const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.get('/api/recs', (req, res) => {
  res.json({
    recommendations: [
      { title: 'Inception', genre: 'Sci-Fi' },
      { title: 'Stranger Things', genre: 'Mystery' }
    ]
  });
});

app.listen(5000, () => console.log('Backend running on http://localhost:5000'));
