const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const session = require("express-session");
const bcrypt = require("bcryptjs"); 
const multer = require('multer')
require('dotenv').config();
const attendanceRoutes = require("./controllers/attendanceController");
const profileRoutes = require("./routes/profile");
const authRoutes = require('./routes/auth');
const list = require("./routes/list");

const app = express();


app.use(express.static(path.join(__dirname, "../public")));


// ✅ Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json()); // ✅ JSON ke liye middleware
app.use(express.urlencoded({ extended: true })); // ✅ URL encoding ke liye middleware


app.use(session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // HTTPS के लिए true करो
}));

// ✅ Routes
app.use("/api/auth",authRoutes);
app.use("/api/fetch",list)
app.use(profileRoutes);

app.use("/api/attend", attendanceRoutes);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "Views")); // ✅ Backend ke andar direct path

// ✅ Static Files
app.get("/", (req, res) => {
    res.redirect(301, "/portal");
});

app.get("/portal", (req, res) => {
    res.sendFile(path.join(__dirname, "../Public/index.html"));
});

app.get("/signin", (req, res) => { 
    res.sendFile(path.join(__dirname, "../public/Login/signin.html"));
});

app.get('/profile', (req, res) => {
    if (!req.session.user) {  // Agar user logged-in nahi hai
        return res.redirect('/login');  // Login page pe bhej do
    }
    res.sendFile(__dirname + '/Public/Admin/profile.html');
});
app.get('/profile', (req, res) => {
    console.log("✅ Profile route hit!");
    res.sendFile(path.join(__dirname, '../public/Student/profile.html'));

});
app.get('/admin_profile', (req, res) => {
    console.log("✅ Profile route hit!");
    res.sendFile(path.join(__dirname, '../public/Admin/profile.html'));
});

// ✅ Ensure API routes are registered
const probackendRoutes = require('./routes/profile');
app.use('/api', probackendRoutes);

app.use((req, res) => {
    res.status(404).json({ status: "error", message: "Route not found" });
});


app.get("/admin/new-registration", (req, res) => {
    res.sendFile(path.join(__dirname, "../Public/Admin/registration.html"));
});

app.get("/admin/user-list", (req, res) => {
    res.sendFile(path.join(__dirname, "../Public/Admin/user-list.html"));
});
app.get("/api/attend/attendance", (req, res) => {
    res.sendFile(path.join(__dirname, "public/Admin/attendance.html"));
});

app.get("/result", (req, res) => {
    const { status, message } = req.query;
    res.render("result", { status, message });
});

// Multer Storage Configuration
const storage = multer.diskStorage({
    destination: "./uploads/",
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});


// Multer Configuration for file upload
// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });

// // POST Route to upload image
// app.post('/upload', upload.single('photo'), (req, res) => {
//     const { name } = req.body;
//     const photo = req.file.buffer;

//     const query = 'INSERT INTO students (name, photo) VALUES (?, ?)';
//     db.query(query, [name, photo], (err, result) => {
//         if (err) throw err;
//         res.send('Image uploaded successfully');
//     });
// });

// // GET Route to fetch image
// app.get('/get-image/:id', (req, res) => {
//     const query = 'SELECT photo FROM students WHERE id = ?';
//     db.query(query, [req.params.id], (err, result) => {
//         if (err) throw err;
//         if (result.length > 0) {
//             res.writeHead(200, { 'Content-Type': 'image/png' });
//             res.end(result[0].photo);
//         } else {
//             res.status(404).send('Image not found');
//         }
//     });
// });


const upload = multer({ storage });

// 🔹 **Fetch Student Data**
app.get("/get-profile", (req, res) => {
    const studentId = req.query.student_id; // Get student_id from query params

    if (!studentId) {
        return res.status(400).json({ error: "Student ID is required" });
    }

    db.query("SELECT * FROM students WHERE student_id = ?", [studentId], (err, results) => {
        if (err) return res.status(500).json({ error: "Database error" });
        if (results.length === 0) return res.status(404).json({ error: "Student not found" });

        res.json(results[0]);
    });
});

app.post("/update-profile", upload.single("photo"), (req, res) => {
    const { student_id, name, fathername, address, course, mobile, email, rollno, year, department, cgpa, marks10, marks12 } = req.body;
    const photo = req.file ? `/uploads/${req.file.filename}` : null;

    if (!student_id) {
        return res.status(400).json({ error: "Student ID is required" });
    }

    const sql = `
        UPDATE students 
        SET username=?, father_name=?, address=?, course_selected=?, mobile_no=?, email=?, rollno=?, registration_date=?,  grade_10=?, grade_12=?, user_photo=COALESCE(?, photo)
        WHERE student_id=?`;
    console.log();
    
    db.query(sql, [name, fathername, address, course, mobile, email, rollno, year, department, cgpa, marks10, marks12, photo, student_id], (err, result) => {
        if (err) return res.status(500).json({ error: "Database update failed" });

        res.json({ message: "Profile updated successfully" });
    });
});





const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`checking path : ${path.join(__dirname, "../View")   }`); 
    
    // console.log(`🚀 Server running on http://${HOST}:${PORT}`);
    console.log("http://localhost:3000/result?status=success&message=Registration successful!", "http://localhost:3000/result?status=error&message=Registration failed!")
        console.log(`🚀 Server running on http://localhost:${PORT}/admin/new-registration`);
        console.log(`🚀 Server running on http://localhost:${PORT}/registration`);
        console.log(`🚀 Server running on http://localhost:${PORT}/View/result.ejs`);
        console.log(`🚀 Server running on http://localhost:${PORT}/profile`);
        console.log(`🚀 Server running on http://localhost:${PORT}/portal`);
        console.log("hello")
        
});
