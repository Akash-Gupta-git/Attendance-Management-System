const express = require("express");
const router = express.Router();
const db = require("../db"); // ✅ Ensure MySQL connection is working

// ✅ Fix API Route Path
router.get("/admin/attendance", (req, res) => {
    const query = "SELECT student_id FROM students"; // ✅ Ensure column names match
    db.query(query, (err, results) => {
        if (err) {
        console.log("asdf", query);
        
            // ✅ Duplicate Entry Error
            if (err.code === 'ER_DUP_ENTRY') {
                console.log("Err db 1:", err.code);
                return res.status(409).json({ status: 'error', message: "Username or Email already exists" });
            }
        
            // ✅ Invalid Field Error
            if (err.code === 'ER_BAD_FIELD_ERROR') {
                console.log("Err db 2:", err.code);
                return res.status(400).json({ status: 'error', message: "Invalid field names" });
            }
        
            // ✅ Table Not Found Error
            if (err.code === 'ER_NO_SUCH_TABLE') {
                console.log("Err db 3:", err.code);
                return res.status(500).json({ status: 'error', message: "Table does not exist" });
            }
        
            // ✅ General Database Error (Hard Coded)
            if (err.code === 'ER_ACCESS_DENIED_ERROR') {
                console.log("Err db 4:", err.code);
                return res.status(403).json({ status: 'error', message: "Access denied to database" });
            }
        
            if (err.code === 'ER_PARSE_ERROR') {
                console.log("Err db 5:", err.code);
                return res.status(400).json({ status: 'error', message: "SQL query syntax error" });
            }
        
            if (err.code === 'ER_LOCK_WAIT_TIMEOUT') {
                console.log("Err db 1:", err.code);
                return res.status(408).json({ status: 'error', message: "Lock wait timeout exceeded" });
            }
        
            // ✅ Unknown Error
            console.error("❌ Database Error:", err);
            return res.status(500).json({ status: 'error', message: "Database operation failed" });
        }
            return res.status(500).json({ error: "Database fetch error" });
        
        console.log("✅ Fetched Students Data:", results); // Debugging
        res.json(results);
    });
});

module.exports = router;
