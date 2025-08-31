const express = require("express");
const router = express.Router();
const { User } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authenticate = require("../middlewares/auth");
const {
  getPasswordResetOTPTemplate,
  getPasswordResetSuccessTemplate,
  getWelcomeEmailTemplate,
} = require("../utils/emailTemplates");
const { sendMail } = require("../utils/mailer");
const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const validatePassword = (password) => {
  const minLength = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasDigit = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  return {
    isValid:
      minLength && hasUpperCase && hasLowerCase && hasDigit && hasSpecialChar,
    message:
      "Password must contain at least 8 characters, 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character",
  };
};

// POST /api/auth/register
router.post("/register", async (req, res) => {
  const { email, password } = req.body;
  try {
    if (await User.findOne({ where: { email } }))
      return res.status(400).json({ message: "User already exists" });

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return res.status(400).json({ message: passwordValidation.message });
    }

    const password_hash = await bcrypt.hash(password, 12);
    const user = await User.create({ email, password_hash });
    await sendMail({
      to: email,
      subject: "Welcome to SafeBait!",
      html: getWelcomeEmailTemplate(email, process.env.FRONTEND_URL),
    });
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

// POST /api/auth/forgot-password
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({
        message: "User not found, Check the email and try again.",
      });
    }

    if (user.resetOTPAttempts >= 5) {
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      if (!user.resetOTPExpiry || user.resetOTPExpiry > oneHourAgo) {
        return res.status(429).json({
          message: "Too many attempts. Please try again in 1 hour.",
        });
      }
      user.resetOTPAttempts = 0;
    }

    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 3 * 60 * 1000);

    await user.update({
      resetOTP: otp,
      resetOTPExpiry: otpExpiry,
      resetOTPAttempts: user.resetOTPAttempts + 1,
    });

    await sendMail({
      to: email,
      subject: "SafeBait - Password Reset OTP (Valid for 3 minutes)",
      html: getPasswordResetOTPTemplate(otp),
    });

    res.json({ message: "If the email exists, an OTP has been sent." });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Verify OTP and Reset Password
router.post("/reset-password", async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res
        .status(400)
        .json({ message: "Email, OTP, and new password are required" });
    }

    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.isValid) {
      return res.status(400).json({ message: passwordValidation.message });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: "Invalid request" });
    }

    if (!user.resetOTP || user.resetOTP !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (!user.resetOTPExpiry || new Date() > user.resetOTPExpiry) {
      return res
        .status(400)
        .json({ message: "OTP has expired. Please request a new one." });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    await user.update({
      password_hash: hashedPassword,
      resetOTP: null,
      resetOTPExpiry: null,
      resetOTPAttempts: 0,
    });

    await sendMail({
      to: email,
      subject: "SafeBait - Password Reset Successful",
      html: getPasswordResetSuccessTemplate(process.env.FRONTEND_URL),
    });

    res.json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
