const express = require('express');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("./db");
require("dotenv").config();

const router = express.Router();


// Middleware to verify JWT token
const authenticateJWT = (req, res, next) => {

  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    return res.status(403).json({ error: "Access denied. No token provided." });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ error: "Invalid token" });

    req.userId = decoded.userId;
    next();
  });
};

// User Registration Route
router.post("/register", (req, res) => {

  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, error: "Username and password are required." });
  }

  // Check if username already exists
  const checkUserQuery = "SELECT * FROM t_users WHERE username = ?";
  db.query(checkUserQuery, [username], (err, results) => {
    if (err) return res.status(500).json({success: false,  error: "Database error" });

    if (results.length > 0) {
      return res.status(400).json({ success: false,  error: "Username already taken" });
    }

    // Hash the password
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) return res.status(500).json({ success: false, error: "Error hashing password" });

      const insertQuery = "INSERT INTO t_users (username, password) VALUES (?, ?)";
      db.query(insertQuery, [username, hashedPassword], (err) => {
        if (err) return res.status(500).json({success: false,  error: "Database error" });
        res.status(201).json({success: true,  message: "User registered successfully" });
      });
    });
  });
});

// User Login Route
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({success: false, error: "Username and password are required." });
  }

  const query = "SELECT * FROM t_users WHERE username = ?";
  db.query(query, [username], (err, results) => {
    if (err) return res.status(500).json({success: false, error: "Database error" });

    if (results.length === 0) {
      return res.status(400).json({ success: false, error: "Invalid username or password" });
    }

    const user = results[0];


    // Compare password with hashed password in database
    bcrypt.compare(password, user.Password, (err, isMatch) => {
      if (err) {
        console.error("Error comparing password:", err);  // Log the error details
        return res.status(500).json({success: false, error: "Error comparing password" });
      }

      if (!isMatch) {
        return res.status(400).json({success: false, error: "Invalid username or password" });
      }
      //console.log("JWT_SECRET:", process.env.JWT_SECRET);
      // Create JWT token
      const token = jwt.sign({ userId: user.UserID }, process.env.JWT_SECRET, { expiresIn: "1h" });

      res.json({success: true, message: "Login successful", token });
    });
  });
});



// Export router and middleware at the END of the file
module.exports = { router, authenticateJWT };
