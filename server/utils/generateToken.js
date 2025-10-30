const jwt = require('jsonwebtoken');

const createToken = (id, role) => {
    try {
        const secret = process.env.JWT_SECRET; 
        const token = jwt.sign({ id, role }, secret, { expiresIn: '2d' });
        return token;
    } catch (error) {
        console.error('Token generation failed:', error.message);
        return null;
    }
};

module.exports = createToken;
