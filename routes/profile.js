
const express = require("express");
const db = require("../db"); // Ensure this is your MySQL connection
// const authenticateUser = require("../middleWare/authMiddleware");

const authenticateToken = require("../middleWare/authMiddleware");

const router = express.Router();

router.get("/profile", authenticateToken, async (req, res) => {
    console.log("🔍 Incoming Profile Request");
    console.log("Query Paraaaaams:", req.query);
    // console.log("Authenticated user:", req.username);
    // if (!req.user) {
    //     return res.status(401).json({ error: "Unauthorized access" });
    // }
    try {
        const username = req.query.username?.trim() || req.user?.username?.trim();
        const Vid = req.query.Vid || req.user?.Vid;
        // const userType = req.query.userType || req.user?.userType;
        if (!username || !Vid) {
            return res.status(400).json({ error: "Username and Vid are required" });
        }
        // 🔹 First, check in the students table
        // If you're using a direct MySQL connection
        const [studentResult] = await db.promise().query("SELECT * FROM students WHERE username = ? AND student_id = ?", [username, Vid]);
        const [teacherResult] = await db.promise().query("SELECT * FROM teachers WHERE username = ? AND teacher_id = ?", [username, Vid]);
        const [adminResult] = await db.promise().query("SELECT * FROM admin WHERE username = ? AND Vid = ?", [username, Vid]);

        if (studentResult.length > 0) {
            console.log("✅ Student Found:", studentResult[0]);
            return res.json({ status: "success", user: studentResult[0], role: "student" });
        }
        if (teacherResult.length > 0) {
            console.log("✅ Teacher Found:", teacherResult[0]);
            return res.json({ status: "success", user: teacherResult[0], role: "teacher" });
        }
        if (adminResult.length > 0) {
            console.log("✅ Admin Found:", adminResult[0]);
            return res.json({ status: "success", user: adminResult[0], role: "admin" });
        }
        console.warn("❌ User not found:", username);
        return res.status(404).json({ status: "error", error: "User not found" });

    } catch (error) {
        console.error("❌ Error in fetching profile:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});


router.get("/admin_profile",authenticateToken, async (req, res) => {
    
    try {
        const username = req.query.username?.trim() || req.user?.username?.trim();
        const Vid = req.query.Vid || req.user?.Vid;
        // const userType = req.query.userType || req.user?.userType;
        if (!username || !Vid) {
            return res.status(400).json({ error: "Username and Vid are required" });
        }
        const [adminResult] = await db.promise().query("SELECT * FROM admin WHERE username = ? AND Vid = ?", [username, Vid]);
        if (adminResult.length > 0) {
            console.log("✅ Admin Found:", adminResult[0]);
            return res.json({ status: "success", user: adminResult[0], role: "admin" });
        }
        db.query(query, [Vid, username], (err, results) => {
            if (err) {
                console.error("❌ MySQL Error:", err.code, "-", err.message);
        
                let errorMessage;
                switch (err.code) {
                    case "ER_ACCESS_DENIED_ERROR":
                        errorMessage = "Database access denied! Check credentials.";
                        break;
                    case "ER_BAD_DB_ERROR":
                        errorMessage = "Database not found!";
                        break;
                    case "ER_PARSE_ERROR":
                        errorMessage = "SQL syntax error! Check query format.";
                        break;
                    case "ER_DUP_ENTRY":
                        errorMessage = "Duplicate entry detected!";
                        break;
                    case "PROTOCOL_CONNECTION_LOST":
                        errorMessage = "Database connection lost!";
                        break;
                    case "ECONNREFUSED":
                        errorMessage = "Database connection refused! Check if MySQL is running.";
                        break;
                    case "ER_NO_SUCH_TABLE":
                        errorMessage = "Table not found in database!";
                        break;
                    default:
                        errorMessage = "Unknown database error!";
                }
                return res.status(500).json({ error: errorMessage });
            }
            if (results.length === 0) 
                return res.status(404).json({ error: "User not found" });

            res.json(results[0]); // ✅ Correct Response
        });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});




module.exports = router;


