const express = require('express');
const db = require("./db"); // Import database connection
const { authenticateJWT } = require("./auth");

const router = express.Router();



// Create a new journal entry
router.post("/", authenticateJWT, (req, res) => {
    const { title, content,category} = req.body;
    const userId = req.userId; // Retrieved from the token
    const createdAt = new Date();

  
    if (!title || !content || !category || !createdAt) {
      return res.status(400).json({success: false, error: "Title, content,category and created_at are required." });
    }
    const insertQuery = "CALL p_InsertJournalEntry(?, ?, ?, ?)";
    db.query(insertQuery, [userId, title, content,category,createdAt], (err, result) => {
      if (err) {
        console.error("Database error:", err); // Logging for debugging
        return res.status(500).json({success: false, error: "Database error" });
      }
      res.status(201).json({success: true, message: "Entry created successfully", entryId: result.insertId });
    });
  });
  

// Get all journal entries for the logged-in user
router.get("/", authenticateJWT, (req, res) => {
  const userId = req.userId;

  const page = parseInt(req.query.page) || 1; 
  const limit = parseInt(req.query.limit) || 10; 

  const offset = (page - 1) * limit;

  const query = `
    SELECT e.id,e.title,e.content,e.created_at,e.UserID, c.CategoryName AS Category
    FROM entries e
    LEFT JOIN t_categories c ON e.Category = c.categoryid 
    WHERE e.UserID = ? 
    LIMIT ? OFFSET ?`;
  
  db.query(query, [userId, limit, offset], (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });

    const countQuery = "SELECT COUNT(*) AS totalEntries FROM entries WHERE UserID = ?";
    db.query(countQuery, [userId], (err, countResults) => {
      if (err) return res.status(500).json({ error: "Database error" });

      const totalEntries = countResults[0].totalEntries;
      const totalPages = Math.ceil(totalEntries / limit);

      res.json({
        entries: results,
        pagination: {
          totalEntries,
          totalPages,
          currentPage: page,
          entriesPerPage: limit,
        },
      });
    });
  });
});


// Get journal entry statistics (entries per day, per year, and category distribution)
router.get("/stats", authenticateJWT, (req, res) => {
  const userId = req.userId;
  
  const query = "CALL p_getentrystats(?)";
  db.query(query, [userId], (err, results) => {
      if (err) {
          console.error("Database error:", err);
          return res.status(500).json({ success: false, error: "Database error" });
      }
      
      if (!results || results.length < 3) {  
          return res.json({ 
            success: true, 
            dates: [], 
            counts: [], 
            years: [], 
            yearCounts: [], 
            categories: [], 
            categoryCounts: [] 
          });
      }
      
      const entryStats = results[0];  // Entries per day
      const yearlyStats = results[1]; // Entries per year
      const categoryStats = results[2]; // Category distribution

      // Process Entries per Day
      const dates = entryStats.map(row => row.entry_date);
      const counts = entryStats.map(row => row.entry_count);

      // Process Entries per Year
      const years = yearlyStats.map(row => row.entry_year);
      const yearCounts = yearlyStats.map(row => row.year_count);

      // Process Category Distribution
      const categories = categoryStats.map(row => row.categoryname);
      const categoryCounts = categoryStats.map(row => row.category_count);

      res.json({ 
        success: true, 
        dates, 
        counts, 
        years, 
        yearCounts, 
        categories, 
        categoryCounts 
      });
  });
});


// Fetch User's Categories
router.get("/categories", authenticateJWT, (req, res) => {
  const userId = req.userId;
  const query = "CALL sp_getcategories(?)";
  
  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error("Database error:", err);  
      return res.status(500).json({ success: false, error: "Database error" });
    }

    res.json({
      success: true,
      categories: results[0] 
    });
  });
});


// Get a specific journal entry by ID for the logged-in user
router.get("/:id", authenticateJWT, (req, res) => {
    const entryId = req.params.id;  
    const userId = req.userId;     
    const query = "CALL p_GetJournalEntryByID(?, ?)";
    db.query(query, [entryId, userId], (err, results) => {
      if (err) return res.status(500).json({ success: false, error: "Database error" });
      if (results.length === 0) {
        
        return res.status(404).json({success: false, error: "Entry not found or unauthorized" });
      }
      res.json({ success: true, data: results[0][0] });
    });
  });
  

// Update a journal entry
router.put("/:id", authenticateJWT, (req, res) => {
    const { title, content, category } = req.body;
    const entryId = req.params.id;
    const userId = req.userId;

    const query = "CALL p_UpdateJournalEntry(?, ?, ?, ?, ?)";

    db.query(query, [entryId, userId, title, content, category], (err, results) => {
        if (err) return res.status(500).json({ success: false, error: "Database error" });

        const affectedRows = results[0][0]?.affectedRows || 0;

        if (affectedRows === 0) {
            return res.status(404).json({ success: false, error: "Entry not found or unauthorized" });
        }

        res.json({ success: true, message: "Entry updated successfully" });
    });
});

// Delete a journal entry
router.delete("/:id", authenticateJWT, (req, res) => {
    const entryId = req.params.id;
    const userId = req.userId;

    const query = "CALL p_DeleteJournalEntry(?, ?)";

    db.query(query, [entryId, userId], (err, results) => {
        if (err) return res.status(500).json({ success: false, error: "Database error" });

        const affectedRows = results[0][0]?.affectedRows || 0;

        if (affectedRows === 0) {
            return res.status(404).json({ success: false, error: "Entry not found or unauthorized" });
        }

        res.json({ success: true, message: "Entry deleted successfully" });
    });
});


// Create a new category
router.post("/categories", authenticateJWT, (req, res) => {
  const { categoryname,CategoryDescription } = req.body;
  const userId = req.userId;

  if (!categoryname || !CategoryDescription) {
    return res.status(400).json({success: false, error: "CategoryDescription and CategoryDescription are required." });
  }

  const query = "CALL p_createcategory(?, ?)";
  db.query(query, [userId, categoryname, CategoryDescription], (err, results) => {
      if (err) {
          console.error("Database error:", err);
          return res.status(500).json({ success: false, error: "Database error" });
      }

      res.status(201).json({
          success: true,
          message: "Category created successfully",
          categoryId: results.insertId
      });
  });
});



// Assign a Category to an Entry
router.patch("/entries/:id", authenticateJWT, (req, res) => {
  const { category_id } = req.body;
  const entryId = req.params.id;

  const query = "CALL sp_assigncategory(?, ?)";
  db.query(query, [entryId, category_id], (err, results) => {
      if (err) {
          console.error("Database error:", err);
          return res.status(500).json({ success: false, error: "Database error" });
      }

      const affectedRows = results[0][0]?.affectedRows || 0;

      if (affectedRows === 0) {
          return res.status(404).json({ success: false, error: "Entry not found or unauthorized" });
      }

      res.json({
          success: true,
          message: "Category assigned successfully"
      });
  });
});



module.exports = router;