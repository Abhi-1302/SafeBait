const jwt = require("jsonwebtoken");
const { User } = require("../models");
const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

module.exports = async function authenticate(req, res, next) {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findByPk(decoded.userId, {
      attributes: ["id", "email", "isAdmin"],
    });
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    req.userId = user.id;
    req.user = user.dataValues;
    next();
  } catch (err) {
    console.error("Auth error:", err); // Log any errors
    res.status(401).json({ message: "Invalid token" });
  }
};
