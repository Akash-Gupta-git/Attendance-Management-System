const jwt = require("jsonwebtoken");
require('dotenv').config();

const authenticateToken = (req, res, next) => {
    try {
        const authHeader = req.header("Authorization");

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ error: "Access denied, no token provided" });
        }

        const token = authHeader.split(" ")[1]; // Token extract karo

        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(403).json({ error: "Invalid or expired token" });
            }
            
            req.user = decoded; // Decoded user info request me store karo
            next();
        });

    } catch (error) {
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = authenticateToken;
