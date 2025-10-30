const validateUser = (req, res, next) => {
    const { name, password, email, phone } = req.body;
    const errors = [];

    if (!name) errors.push("User's name is required.");
    if (!password) errors.push("Password is required.");

    if (!email) errors.push("Email is required.");
    if (!phone) errors.push("Phone number is required.");

    if (email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            errors.push("Invalid email format.");
        }
    }

    if (phone) {
        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(phone)) {
            errors.push("Phone number must be exactly 10 digits.");
        }
    }

    if (errors.length > 0) {
        return res.status(400).json({ success: false, errors, message: 'Bad Request' });
    }

    next();
}

module.exports = validateUser;
