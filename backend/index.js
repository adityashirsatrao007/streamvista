const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const connectDB = require("./db");
const History = require("./models/History");
const User = require("./models/User"); // ✅ new
const { spawn } = require("child_process");
const bcrypt = require("bcryptjs"); // ✅ new
const jwt = require("jsonwebtoken"); // ✅ new

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// ✅ Register User
app.post("/api/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ msg: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const newUser = new User({ username, email, password: hashed });
    await newUser.save();

    res.status(201).json({ msg: "Registered successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Login User
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, "yourSecretKey", {
      expiresIn: "2d",
    });

    res.json({
      token,
      user: { id: user._id, username: user.username, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

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

// ML Predict Endpoint
app.post("/api/predict", (req, res) => {
  const input = JSON.stringify(req.body.input); // Example: [1, 0, 1, 0]

  const python = spawn("py", ["-3.11", "ml/predict.py", input]);

  let output = "";
  python.stdout.on("data", (data) => {
    output += data.toString();
  });

  python.stderr.on("data", (data) => {
    console.error(`Python error: ${data}`);
  });

  python.on("close", (code) => {
    try {
      const result = JSON.parse(output);
      res.json({ prediction: result });
    } catch (e) {
      console.error("Output parse error:", output);
      res.status(500).json({ error: "Prediction failed", detail: output });
    }
  });
});

// Start Server
app.listen(process.env.PORT || 5000, () =>
  console.log(
    `✅ Backend running on http://localhost:${process.env.PORT || 5000}`
  )
);
