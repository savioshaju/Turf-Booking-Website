const User = require('../models/userModel.js')
const bcrypt = require('bcrypt')
const { json } = require('express')
const jwt = require('jsonwebtoken')
const createToken = require('../utils/generateToken.js')

const signup = async (req, res) => {

    try {
        const { name, email, password, phone } = req.body || {}

        const userExist = await User.findOne({ email })
        if (userExist) {
            return res.status(400).json({ success: false, message: "User already exists" })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            phone,
            role: 'user',
            status: 'active'
        })
        const savedUser = await newUser.save()


        const token = createToken(savedUser._id, savedUser.role);
        console.log("Token:", token);

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'PRODUCTION',
            sameSite: 'Strict',
            maxAge: 2 * 24 * 60 * 60 * 1000
        });

        const { password: _, ...userData } = savedUser.toObject();
        res.status(201).json({ success: true, message: "User registered successfully", data: userData });


    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Signup : Server error' });
    }

}

const login = async (req, res) => {

    try {
        const { email, password } = req.body || {}
        const errors = [];

        if (!email) errors.push("Email is required.");

        if (email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                errors.push("Invalid email format.");
            }
        }

        if (!password) errors.push("Password is required.");

        if (errors.length > 0) {
            return res.status(400).json({ success: false, errors, message: 'Bad Request' });
        }
        const userExist = await User.findOne({ email })
        if (!userExist) {
            return res.status(400).json({ success: false, message: "User does not exists" })
        }

        const passwordMatch = await bcrypt.compare(password, userExist.password)


        if (!passwordMatch) {
            return res.status(400).json({ success: false, message: "Not a valid password" })
        }


        const token = createToken(userExist._id, userExist.role);
        console.log("Token:", token);

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'PRODUCTION',
            sameSite: 'Strict',
            maxAge: 2 * 24 * 60 * 60 * 1000
        });

        const { password: _, ...userData } = userExist.toObject();
        res.status(200).json({ success: true, message: 'Login successful', data: userData });


    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Login : Server error' });
    }

}

const profile = async (req, res) => {
    try {

        const userId = req.user?.id

        if (!userId) {
            return res.status(401).json({ success: false, message: 'Unauthorized: Invalid token data.' })
        }

        const user = await User.findById(userId)

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found.' })
        }
        const { password: _, ...userData } = user.toObject();
        res.status(200).json({ success: true, message: 'Profile fetched successfully', data: userData })

    } catch (error) {
        console.error('Profile Error:', error)
        res.status(500).json({ success: false, message: 'Profile : Server error' })
    }
}

const checkUser = async (req, res) => {
    try {
        const userId = req.user?.id

        if (!userId) {
            return res.status(401).json({ success: false, message: 'Unauthorized: Invalid token data.' })
        }

        const user = await User.findById(userId).select('-password')
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found.' })
        }

        res.status(200).json({ success: true, message: 'User authenticated successfully', data: user })

    } catch (error) {
        console.error('Check User Error:', error)
        res.status(500).json({ success: false, message: 'Check User Error : Server error' })
    }
}

const checkAdmin = async (req, res) => {
    try {
        const userId = req.user?.id

        if (!userId) {
            return res.status(401).json({ success: false, message: 'Unauthorized: Invalid token data.' })
        }

        const user = await User.findById(userId).select('-password')
        if (!user) {
            return res.status(404).json({ success: false, message: 'Admin not found.' })
        }

        if (user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'User is not admin' });
        }


        res.status(200).json({ success: true, message: 'Admin authenticated successfully', data: user })

    } catch (error) {
        console.error('Check User Error:', error)
        res.status(500).json({ success: false, message: 'Check Admin Error : Server error' })
    }
}

const updateUser = async (req, res) => {
    try {
        const { name, email, password, phone } = req.body || {}

        const userId = req.user?.id

        if (!userId) {
            return res.status(401).json({ success: false, message: 'Unauthorized: Invalid token data.' })
        }

        const errors = [];

        if (email) {
            const userExist = await User.findOne({ email })
            if (userExist) {
                return res.status(400).json({ success: false, message: "User already exists" })
            }

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

        const updateData = {};
        if (name) updateData.name = name;
        if (email) updateData.email = email;
        if (phone) updateData.phone = phone;

        if (password) {
            const salt = await bcrypt.genSalt(10);
            updateData.password = await bcrypt.hash(password, salt);
        }


        const newUser = await User.findByIdAndUpdate(userId, { $set: updateData }, { new: true }).select('-password')
        if (!newUser) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        res.status(200).json({ success: true, message: 'User profile updated successfully', data: newUser });
    } catch (error) {
        console.error('User Update Error :', error)
        res.status(500).json({ success: false, message: ' User Update Error: Server error' })
    }
}

const updateUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const { role, status } = req.body || {};

        if (!id) {
            return res.status(400).json({ success: false, message: 'User ID is required.' })
        }

        if (!role && !status) {
            return res.status(400).json({ success: false, message: 'Nothing to update.' })
        }

        const validStatus = ['active', 'banned']
        const validRoles = ['user', 'admin']

        if (role && !validRoles.includes(role)) {
            return res.status(400).json({ success: false, message: 'Invalid role provided.' })
        }

        if (status && !validStatus.includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid status provided.' });
        }

        const updateData = {};
        if (role) updateData.role = role;
        if (status) updateData.status = status;

        const updatedUser = await User.findByIdAndUpdate(id, { $set: updateData }, { new: true }).select('-password');

        if (!updatedUser) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        res.status(200).json({ success: true, message: 'User role / status updated successfully by admin', data: updatedUser });

    } catch (error) {
        console.error('Admin Update Role/Status Error:', error);
        res.status(500).json({
            success: false,
            message: 'Admin Update Role/Status Error: Server error'
        });
    }
};

const deleteUserById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ success: false, message: 'User ID is required.' });
        }

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        await User.findByIdAndDelete(id);

        res.status(200).json({ success: true, message: 'User deleted successfully by admin.' });

    } catch (error) {
        console.error('Admin Delete User Error:', error);
        res.status(500).json({ success: false, message: 'Admin Delete User Error: Server error' });
    }
};

const deleteUser = async (req, res) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ success: false, message: 'Unauthorized: Invalid token data.' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        await User.findByIdAndDelete(userId);

        res.clearCookie('token');

        res.status(200).json({ success: true, message: 'User account deleted successfully.' });

    } catch (error) {
        console.error('Delete User Error:', error);
        res.status(500).json({ success: false, message: 'Delete User Error: Server error' });
    }
};

const logout = async (req, res) => {
    try {
        res.clearCookie("token")


        res.status(200).json({ success: true, message: 'User Logout successfully.' });
    } catch (error) {
        console.error('Logout Error:', error);
        res.status(500).json({ success: false, message: 'Logout Error: Server error' });
    }
}


module.exports = { signup, login, profile, checkUser, checkAdmin, updateUser, updateUserById, deleteUser, deleteUserById, logout }