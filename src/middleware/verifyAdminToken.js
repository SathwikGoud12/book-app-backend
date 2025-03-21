const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET_KEY;

const verifyAdminToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];

    console.log('Token received:', token); // Debug: Log the token
    console.log('JWT_SECRET:', JWT_SECRET); // Debug: Log the secret

    if (!token) {
        return res.status(401).json({ message: 'Access Denied. No token provided' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            console.log('Token verification error:', err.message); // Debug: Log the error
            return res.status(403).json({ message: 'Invalid credentials' });
        }

        console.log('Decoded user:', user); // Debug: Log the decoded user
        req.user = user;

        // Check if the user is an admin
        if (user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admin only.' });
        }

        next();
    });
};

module.exports = verifyAdminToken;