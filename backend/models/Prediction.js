const mongoose = require("mongoose");

const predictionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  inputData: { type: Object, required: true },
  probability: { type: Number, required: true },
  readinessScore: { type: Number, required: true },
  strengths: { type: Array, required: true },
  weaknesses: { type: Array, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Prediction", predictionSchema);