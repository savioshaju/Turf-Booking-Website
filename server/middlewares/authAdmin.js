const jwt = require('jsonwebtoken');

const authAdmin = (req, res, next) => {
    try {
        const { token } = req.cookies;


        if (!token) {
            return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded) {
            return res.status(401).json({ success: false, message: 'Invalid token.' });
        }

        if (decoded.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Admin access required.' });
        }

        req.user = decoded;

        next();
    } catch (error) {
        console.error('Auth Error:', error);
        return res.status(401).json({ success: false, message: 'Admin Auth : Invalid or expired token.' });
    }
};

module.exports = authAdmin;
