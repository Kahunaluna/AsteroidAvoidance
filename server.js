require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.static(__dirname));

const highScoreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 20
  },
  score: {
    type: Number,
    required: true,
    min: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const HighScore = mongoose.model("AsteroidHighscore", highScoreSchema);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/high-scores", (req, res) => {
  res.sendFile(path.join(__dirname, "high-scores.html"));
});

app.get("/api/scores", async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 10;
    const scores = await HighScore.find()
      .sort({ score: -1, createdAt: 1 })
      .limit(limit);
    res.json(scores);
  } catch (err) {
    res.status(500).json({ message: "Failed to load scores" });
  }
});

app.post("/api/scores", async (req, res) => {
  try {
    const name = typeof req.body.name === "string" ? req.body.name.trim() : "";
    const score = Number(req.body.score);

    if (!name || Number.isNaN(score)) {
      return res.status(400).json({ message: "Name and score are required" });
    }

    const entry = await HighScore.create({ name, score });
    res.status(201).json(entry);
  } catch (err) {
    res.status(500).json({ message: "Failed to save score" });
  }
});

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error", err);
  });
