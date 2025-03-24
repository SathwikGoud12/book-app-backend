const jwt = require('jsonwebtoken');
require('dotenv').config(); // Ensure .env variables are loaded

const JWT_SECRET = process.env.JWT_SECRET_KEY;

// Debugging: Check if JWT_SECRET is loaded
if (!JWT_SECRET) {
    console.error("🚨 Error: JWT_SECRET_KEY is missing in .env file!");
    process.exit(1); // Stop server if secret key is not set
}

const verifyAdminToken = (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];

        if (!authHeader) {
            return res.status(401).json({ message: 'Access Denied. No token provided' });
        }

        const token = authHeader.split(' ')[1]; // Get token from "Bearer <token>"
        
        if (!token) {
            return res.status(401).json({ message: 'Invalid token format' });
        }

        console.log('🔑 Token received:', token);

        // Debugging: Try decoding before verifying
        const decoded = jwt.decode(token, { complete: true });
        if (!decoded) {
            console.error('⛔ Invalid token format');
            return res.status(403).json({ message: 'Invalid token' });
        }
        console.log('🛠 Decoded Token:', decoded);

        // Verify JWT
        jwt.verify(token, JWT_SECRET, (err, user) => {
            if (err) {
                console.error('❌ Token verification error:', err.message);
                return res.status(403).json({ message: 'Invalid credentials' });
            }

            console.log('✅ Decoded user:', user);
            req.user = user;

            // Ensure user has admin privileges
            if (user.role !== 'admin') {
                return res.status(403).json({ message: 'Access denied. Admin only.' });
            }

            next(); // Proceed to the next middleware
        });

    } catch (error) {
        console.error('🚨 Middleware Error:', error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = verifyAdminToken;
