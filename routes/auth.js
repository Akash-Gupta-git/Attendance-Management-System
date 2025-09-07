const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db");
const path = require("path");
const mysql = require('mysql2');
const { error } = require("console");


require('dotenv').config();

const router = express.Router();



// Helper function to generate IDs
const generateStudentID = () => "STU" + Date.now(); // Example ID generator
const generateTeacherID = () => "TCH" + Date.now();


// 🟢 SIGNUP API
router.post("/admin/new-registration", async (req, res) => {
    res.setHeader("Content-Type", "application/json");

    console.log("auth se check kiya :", req.body);
      
    try {
        console.log("Received Data:", req.body); 
        const {
            username,
            fullName,
            mobileNumber,
            confirmMobileNumber,
            email,
            confirmEmail,
            password,
            confirmPassword,
            course,
            userType
        } = req.body;
        
        // ✅ Validation Fix   
        if (!username || !fullName || !mobileNumber || !confirmMobileNumber ||
            !email || !confirmEmail || !password || !confirmPassword || !course || !userType) {
            return res.status(400).json({status :  'error', message: "All fields 777are required" });  
        }
        
        // ✅ Matching Mobile Numbers Check
         const mobileRegex = /^(\+91)?[6-9]\d{9}$/;
        if (!mobileRegex.test(mobileNumber) || !mobileRegex.test(confirmMobileNumber)) {
             return res.status(400).json({status :  'error', message : "Invalid mobile number format!!" });
        }
        if (mobileNumber !== confirmMobileNumber) {
            return res.status(400).json({ status: "error", message: "Mobile numbers do not match" });
        }
            
        // ✅ Matching Emails Check
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+$/;
        if (!emailRegex.test(email) || !emailRegex.test(confirmEmail)) {
            return res.status(400).json({ status: "error", message: "Invalid email format!!" });
        }
        if (email !== confirmEmail) {
            return res.status(400).json({ status: "error", message: "Email do not match" });
        }
    
        // ✅ Password Matching Check
        if (password !== confirmPassword) {
            return res.status(400).json({ status: "error", message: "Password do not match" });
        }
    
        // ✅ Course Selection Check
        if (!course || course === "select Course") {
            return res.status(400).json({ status: "error", message: "Please select course" });
        }
        if (!userType || !["student", "teacher"].includes(userType.toLowerCase())) {
            return res.status(400).json({ status: "error", message: "Invalid user type. Must be 'student' or 'teacher'" });
        }

        let tableName;
        if (userType.toLowerCase() === "student") {
            tableName = "students";
        } else if (userType.toLowerCase() === "teacher") {
            tableName = "teachers";
        } else if (userType.toLowerCase() === "admin") {
            tableName = "admin";
        } else {
            return res.status(400).json({ error: "❌ Invalid userType" });
        }
        console.log("➡️ Table Name registration:", tableName);

        const idColumn = userType.toLowerCase() === "student" ? "student_id" : "teacher_id";
        const idValue = userType.toLowerCase() === "student" ? generateStudentID() : generateTeacherID();
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const query = `INSERT INTO ${tableName} (${idColumn},  username, full_name, mobile_no, email, password, course_selected, registration_date) VALUES (?, ?, ?, ?, ?, ?, ?, NOW()) `;

        db.query(query, [idValue      , username, fullName, mobileNumber, email, hashedPassword, course], (err, result) => {
            try {
                // Existing registration logic...
                if (err) {
                    console.error(`❌ Error inserting into ${tableName}:`, err);
                
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
                if (result.affectedRows === 0) {
                    console.error("❌ No rows affected. Registration failed.");
                    return res.status(400).json({ status: 'error', message: "Registration failed" });
                }
                
             
                // ✅ Success response
                console.log("✅ User Registered Successfully:", result);
                
                return res.status(201).json({ 
                    status: "success",
                    message: "✅ Registration successful",
                    userId: idValue
                });
            } catch (error) {
                console.error("❌ Signup Error catch:", error);
            }
        });


    } catch (error) {
        console.error("❌ Signup Error:", error);
        // res.status(500).json({ error: "Internal Server Error" });
        // return res.redirect(`/result?status=error&message=${encodeURIComponent('Registration failed')}`);
    }
});


  
        require('dotenv').config();
        const authenticateToken = require("../middleWare/authMiddleware");

        router.post("/verifyToken", authenticateToken, (req, res) => {
            try {
                res.json({ valid: true, user: req.user });
            } catch (error) {
                console.error("❌ Error in verifyToken:", error.message); // Log the error for debugging
                return res.status(401).json({ valid: false, message: "Invalid token" });
            }
        });
        

    router.post("/signin", async (req, res) => {
        // console.log("body aa rhi hai ", req.body)
        try {
            // console.log("Request Body:", req.body); // ✅ Data aa raha hai ya nahi check karo

            const { identifier, password, userType } = req.body;
            // console.log(`Username: ${identifier}, Password: ${password}, UserType: ${userType}`);

            // if (!identifier || !password || !userType) {
            //     return res.status(400).json({ status: 'error', message: "❌ All fields are required" });
            // }
            if (!identifier ) {
                return res.status(400).json({ status: 'error', message: "❌Incorrect username or Email" });
            }
            if (!password ) {
                return res.status(400).json({ status: 'error', message: "❌ Incorrect Password" });
            }

            let tableName;
            let Vid;
            if (userType.toLowerCase() === "student") {
                tableName = "students";
                Vid = "student_id"
            } else if (userType.toLowerCase() === "teacher") {
                tableName = "teachers";
                Vid = "teacher_id"
            } else if (userType.toLowerCase() === "admin") {
                tableName = "admin";
                Vid = "Vid"
            } else {
                return res.status(400).json({ status: 'error', messag: "❌ Invalid userType" });
            }
            // console.log("➡️ Table Name:", tableName);

            // ✅ Parameterized Query to Prevent SQL Injection
           
            // ✅ Database query
            const query = `SELECT  username, \`${Vid}\`, password FROM \`${tableName}\` WHERE username = ? OR \`${Vid}\` = ?`;
            const [results] = await db.promise().query(query, [identifier, identifier]);

      
            // console.log("DB Results:", results);
            console.log(query);
            
            if (results.length === 0) {
                return res.status(400).json({ status: 'error', message: "User not found" });
            }

            const user = results[0];
            console.log("DB User:", user);
            const isPasswordValid = await bcrypt.compare(password, user.password);
            
            // Check if user is already logged in
            if (user.is_logged_in) {
                return res.status(403).json({ message: "User is already logged in!" });
            }
            await db.promise().query(`UPDATE \`${tableName}\` SET is_logged_in = TRUE WHERE \`${Vid}\` = ?`, [identifier]);


            // if (!isPasswordValid) {
            //     return res.status(401).json({ status: 'error', message: "Invalid password" });
            // }
            // ✅ JWT Token Generation
            const token = jwt.sign(
                {
                    username: user.username,  
                    email: user.email,  
                    Vid: user[Vid],  // ✅ Assuming "Vid" is a key in "user"  
                    userType: userType.toLowerCase(),  // ✅ Ensure lowercase consistency
                },
                process.env.JWT_SECRET,  // ✅ Use a strong secret key
                { expiresIn: "1h" }
            );
            console.log("auth mein ",user[Vid]);
            

            // console.log("✅ Token Generated:", token);
            // ✅ Successful Login
            return res.status(200).json({
                status: "success",
                message: "✅ Login successful",
                token,
                user: {
                    username: user.username,
                    email: user.email,
                    password: user.password,
                    Vid: user[Vid],
                    userType
                },
                redirectUrl: `/profile?username=${encodeURIComponent(user.username)}` // ✅ Correct URL
            });
            
        
            
        } catch (error) {
            console.error("❌ Sign-in Error:", error);
            // ✅ Error Handling - Redirect to Result Page
            return res.status(500).json({
                status: "error",
                message: "Internal Server Error"
                // redirectUrl: `/result?status=error&message=${encodeURIComponent("Internal Server Error")}`
            });
        }
    });




    // Logout Route
    const blacklistedTokens = new Set(); // Ya Redis ka use karo

    // router.post('/logout', (req, res) => {
    //     const token = req.headers.authorization?.split(" ")[1];
    //     if (!token) {
    //         return res.status(400).json({ message: "Token required" });
    //     }
    //     blacklistedTokens.add(token); // Token blacklist kar diya
    //     res.json({ message: "Logout successful" });
    // });
    // router.use((req, res, next) => {
    //     const token = req.headers.authorization?.split(" ")[1];
    //     if (blacklistedTokens.has(token)) {
    //         return res.status(401).json({ message: "Token is invalid. Please log in again." });
    //     }
    //     next();
    // });


    
// ✅ Logout Route
router.post("/logout", (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(400).json({ message: "Token required" });
    }

    blacklistedTokens.add(token); // Blacklist the token
    res.json({ message: "Logout successful" });
});

// ✅ Middleware to Check Blacklisted Tokens
router.use((req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (blacklistedTokens.has(token)) {
        return res.status(401).json({ message: "Token is invalid. Please log in again." });
    }

    next();
});

    
    module.exports = router;
    