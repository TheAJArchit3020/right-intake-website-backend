const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const Admin = require("../models/Admin"); // A simple schema with email + password
const bcrypt = require("bcrypt");

// Replace with your own secure secret in production
const JWT_SECRET = process.env.JWT_SECRET || "secret_token_key";

// Admin Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(401).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, admin.password);
    if (!match) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ adminId: admin._id }, JWT_SECRET, {
      expiresIn: "2h",
    });
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Token Middleware
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.adminId = decoded.adminId;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = { adminRouter: router, verifyToken };
