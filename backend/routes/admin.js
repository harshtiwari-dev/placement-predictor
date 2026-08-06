const express = require("express");
const User = require("../models/User");
const Prediction = require("../models/Prediction");
const authMiddleware = require("../middleware/auth");
const adminMiddleware = require("../middleware/admin");

const router = express.Router();

router.use(authMiddleware);
router.use(adminMiddleware);

router.get("/users", async (req, res) => {
  try {
    const users = await User.find({}, "-password").sort({ createdAt: -1 });

    res.json(users);
  } catch (err) {
    res.status(500).json({
      message: "Error fetching users",
      error: err.message,
    });
  }
});

router.get("/predictions", async (req, res) => {
  try {
    const predictions = await Prediction.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json(predictions);
  } catch (err) {
    res.status(500).json({
      message: "Error fetching predictions",
      error: err.message,
    });
  }
});

module.exports = router;