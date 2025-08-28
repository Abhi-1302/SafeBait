const express = require("express");
const router = express.Router();
const { User } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authenticate = require("../middlewares/auth");
const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

// POST /api/auth/register
router.post("/register", async (req, res) => {
  const { email, password } = req.body;
  try {
    if (await User.findOne({ where: { email } }))
      return res.status(400).json({ message: "User already exists" });

    const password_hash = await bcrypt.hash(password, 12);
    const user = await User.create({ email, password_hash });
    res.json({ id: user.id, email: user.email });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password_hash)))
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: "2h",
    });
    res.json({ token, isAdmin: user.isAdmin, email: user.email });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/auth/me
router.get("/me", authenticate, async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findByPk(userId, {
      attributes: ["id", "email", "isAdmin"],
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error in /auth/me:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
