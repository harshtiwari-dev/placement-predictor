const express = require("express");
const axios = require("axios");

const router = express.Router();

router.post("/predict", async (req, res) => {
  try {
    const response = await axios.post("http://localhost:5000/predict", req.body);
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ message: "Prediction service error", error: err.message });
  }
});

module.exports = router;