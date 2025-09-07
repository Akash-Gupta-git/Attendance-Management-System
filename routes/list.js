const express = require("express");
const router = express.Router();
const db = require("../db"); // ✅ Ensure your database connection is correct
    
// ✅ API to get students
router.get("/admin/user-list", (req, res) => {
    const query = "SELECT * FROM students";
    db.query(query, (err, results) => {
        if (err) {
            console.error("❌ MySQL Fetch Error:", err.message);
            return res.status(500).json({ error: err.message });
        }
        // console.log("✅ Fetched Students Data:", results); // ✅ Debugging ke liye
        res.json(results);
    });
});

module.exports = router;
