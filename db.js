const mysql = require("mysql2");
require("dotenv").config();

// ✅ Create MySQL Connection Pool (Best Practice)
const db = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASS || "Akash@1234",
    database: process.env.DB_NAME || "attendance_management_system",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

db.getConnection((err, connection) => {
    if (err) {
        console.error("❌ MySQL Connection Failed:", err.message);
    } else {
        console.log("✅ MySQL Database Connected!");
        connection.release();
    }
});




module.exports = db;
