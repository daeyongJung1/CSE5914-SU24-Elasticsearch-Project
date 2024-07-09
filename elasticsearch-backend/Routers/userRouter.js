// userRouter.js

const express = require('express');
const router = express.Router();
const User = require('../Schemas/user.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const secretKey = 'your_secret_key'

// Signup Route
router.post('/signup', async (req, res) => {
    const { username, password } = req.body;
    try {
        const newUser = new User({ username, password });
        await newUser.save();
        res.status(201).send('User created successfully');
    } catch (error) {
        res.status(500).json({ error: 'Error signing up user' });
    }
});


// Login Route
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).send('User not found');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send('Invalid credentials');
        }

        // Create a token
        const token = jwt.sign(
            { id: user._id, username: user.username },  // You can add more fields here
            secretKey,
            { expiresIn: '1h' }  // Token expires in one hour
        );

        res.json({ message: 'Login successful', token });
    } catch (error) {
        res.status(500).json({ error: 'Error logging in' });
    }
});

const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];  // Bearer Token
    if (!token) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }
    try {
        const decoded = jwt.verify(token, secretKey);
        req.user = decoded;
        next();
    } catch (ex) {
        res.status(400).json({ error: 'Invalid token.' });
    }
};


// Update Preferences Route
router.patch('/preference', verifyToken, async (req, res) => {
    const { preferences } = req.body;  // Assumes preferences are sent in the body
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Update preferences
        user.preferences = preferences;  // Adjust according to your User schema
        await user.save();

        // Create a new token
        const newToken = jwt.sign(
            { id: user._id, username: user.username, preferences: user.preferences },
            secretKey,
            { expiresIn: '1h' }
        );

        res.json({ message: 'Preferences updated successfully', token: newToken });
    } catch (error) {
        res.status(500).json({ error: 'Error updating preferences' });
    }
});

module.exports = router;
