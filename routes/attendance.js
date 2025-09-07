// const express = require("express");
// const db = require("../db");
// const path = require("path");


// const router = express.Router();


// router.get("/attendance", (req, res) => {
//     res.sendFile(path.join(__dirname, "../public/Admin/Attendance/attendance.html"));
// });

// router.get('/students', (req, res) => {
//     const { courseId } = req.query;
//     let query = `
//         SELECT s.id, s.name, s.email, s.photo, c.course_name 
//         FROM students s
//         JOIN courses c ON s.course_id = c.id
//     `;
//     if (courseId) {
//         query += ` WHERE s.course_id = ?`;
//     }
//     db.query(query, [courseId], (err, results) => {
//         if (err) return res.status(500).json({ error: err.message });
//         res.json(results);
//     });
// });


// // ➡️ Mark Attendance
// router.post("/mark", async (req, res) => {
//     const { studentId, status } = req.body;

//     if (!studentId || !status) {
//         return res.status(400).json({ error: "All fields are required" });
//     }

//     try {
//         const date = new Date().toISOString().split('T')[0];

//         const query = `INSERT INTO attendance (student_id, date, status)
//                        VALUES (?, ?, ?) 
//                        ON DUPLICATE KEY UPDATE status = ?`;

//         await db.query(query, [studentId, date, status, status]);

//         return res.status(200).json({ message: "Attendance marked successfully" });
//     } catch (error) {
//         console.error("Error:", error);
//         return res.status(500).json({ error: "Database error" });
//     }
// });

// // ➡️ Fetch Attendance
// router.get("/:studentId", async (req, res) => {
//     const { studentId } = req.params;

//     try {
//         const query = `SELECT * FROM attendance WHERE student_id = ?`;
//         const [result] = await db.query(query, [studentId]);
//         return res.status(200).json(result);
//     } catch (error) {
//         console.error("Error:", error);
//         return res.status(500).json({ error: "Database error" });
//     }
// });


// module.exports = router;




// routes/attendance.js
const express = require("express");
const db = require("../db"); // Adjust path to your DB connection file

const router = express.Router();

// ✅ API to fetch all students for attendance view
router.get("/attendance", async (req, res) => {
    const query = `
        SELECT 
            s.id AS student_id,
            s.enroll_no,
            s.username,
            s.email,
            c.course_name AS course
        FROM students s
        JOIN courses c ON s.course_id = c.id
    `;

    try {
        const [students] = await db.query(query);
        res.status(200).json(students);
    } catch (error) {
        console.error("❌ Error fetching students:", error);
        res.status(500).json({ error: "Failed to fetch students" });
    }
});

// ✅ API to mark attendance for multiple students
router.post("/attendance", async (req, res) => {
    const attendanceData = req.body;

    if (!Array.isArray(attendanceData) || attendanceData.length === 0) {
        return res.status(400).json({ error: "Attendance data required" });
    }

    const date = new Date().toISOString().split('T')[0];

    try {
        const promises = attendanceData.map(({ student_id, status }) => {
            const query = `
                INSERT INTO attendance (student_id, date, status)
                VALUES (?, ?, ?)
                ON DUPLICATE KEY UPDATE status = ?
            `;
            return db.query(query, [student_id, date, status, status]);
        });

        await Promise.all(promises);
        res.status(200).json({ message: "✅ Attendance marked successfully!" });
    } catch (error) {
        console.error("❌ Error submitting attendance:", error);
        res.status(500).json({ error: "Database error during attendance marking" });
    }
});

module.exports = router;
