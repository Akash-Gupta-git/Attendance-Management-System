
// // User registration route
// app.post('/admin/new-registration', async (req, res) => {
//     const { username, fullName, mobileNumber, email, password, course, userType } = req.body;

//     if (!username || !fullName || !mobileNumber || !email || !password || !course || !userType) {
//         return res.status(400).json({ message: 'All fields are required' });
//     }

//     try {
//         // Check if user already exists
//         const [existingUser] = await db.promise().query('SELECT * FROM users WHERE email = ? OR username = ?', [email, username]);
//         if (existingUser.length > 0) {
//             return res.status(409).json({ message: 'Username or Email already exists' });
//         }

//         // Hash the password
//         const hashedPassword = await bcrypt.hash(password, 10);

//         // Insert user into the database
//         await db.promise().query('INSERT INTO users (username, fullName, mobileNumber, email, password, course, userType) VALUES (?, ?, ?, ?, ?, ?, ?)', 
//         [username, fullName, mobileNumber, email, hashedPassword, course, userType]);

//         res.status(201).json({ status: 'success', message: 'Registration successful' });
//     } catch (error) {
//         console.error('Registration error:', error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// });
