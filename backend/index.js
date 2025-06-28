const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const connectDB = require("./db");
const History = require("./models/History");

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Static Recommendation Endpoint
app.get("/api/recs", async (req, res) => {
  try {
    res.json({
      recommendations: [
        { title: "Inception", genre: "Sci-Fi" },
        { title: "Stranger Things", genre: "Mystery" },
        { title: "Dark", genre: "Thriller" },
        { title: "Breaking Bad", genre: "Crime" },
      ],
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Log Watch History [POST]
app.post("/api/history", async (req, res) => {
  const { userId, movieTitle, genre } = req.body;

  try {
    const entry = new History({ userId, movieTitle, genre });
    await entry.save();
    res.json({ success: true, entry });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Fetch Watch History [GET]
app.get("/api/history", async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res
      .status(400)
      .json({ success: false, error: "Missing userId in query" });
  }

  try {
    const history = await History.find({ userId }).sort({ watchedAt: -1 });
    res.json({ success: true, history });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Start Server
app.listen(process.env.PORT || 5000, () =>
  console.log(
    `✅ Backend running on http://localhost:${process.env.PORT || 5000}`
  )
);
