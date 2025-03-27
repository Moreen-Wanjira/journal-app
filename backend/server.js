const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { authenticateJWT } = require('./auth');  // Import the authenticateJWT middleware

const authRoutes = require('./auth');  // Import auth routes
const entriesRoutes = require('./entries');  // Import entries routes

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Apply authenticateJWT middleware to protect the /entries routes
app.use('/entries', authenticateJWT, entriesRoutes); // Now the /entries routes are protected by JWT

// Routes
app.use('/auth', authRoutes.router);  // Use the auth routes

app.use((req, res, next) => {
  next();
});

// Default route
app.get("/", (req, res) => {
  res.send("📖 Personal Journal API is running...");
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
