const express = require("express");
const axios = require("axios");
const authMiddleware = require("../middleware/auth");
const Prediction = require("../models/Prediction");

const router = express.Router();

router.post("/predict", authMiddleware, async (req, res) => {
  try {
    const response = await axios.post("http://localhost:5000/predict", req.body);

    const newPrediction = new Prediction({
      user: req.user.id,
      inputData: req.body,
      probability: response.data.probability,
      readinessScore: response.data.readiness_score,
      strengths: response.data.strengths,
      weaknesses: response.data.weaknesses
    });

    await newPrediction.save();

    res.json(response.data);
  } catch (err) {
    res.status(500).json({ message: "Prediction service error", error: err.message });
  }
});

module.exports = router;