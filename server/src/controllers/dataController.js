const User = require("../models/User");
const Checkpoint = require("../models/Checkpoint");
const Scan = require("../models/Scan");


// GET /api/data/users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-passwordHash")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: users.length,
      data: users,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// GET /api/data/checkpoints
exports.getCheckpoints = async (req, res) => {
  try {
    const checkpoints = await Checkpoint.find()
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: checkpoints.length,
      data: checkpoints,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// GET /api/data/scans
exports.getScans = async (req, res) => {
  try {
    const scans = await Scan.find()
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: scans.length,
      data: scans,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
