const express = require('express');
const router = express.Router();
const User = require('../Schemas/user.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const secretKey = 'krabby-patty-secret-formula'

// Signup Route
router.post('/signup', async (req, res) => {
    const { username, password } = req.body;
    try {
        const newUser = new User({ username, password: password });
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

        const returnPayload = {   
            id: user._id, 
            username: user.username,
            preferences: user.preferences,
            queries: user.queries
        }

        // Create a token
        const token = jwt.sign(returnPayload, secretKey, { expiresIn: '1h' });

        res.json({ message: 'Login successful', token, user: returnPayload });
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
router.patch('/preferences', verifyToken, async (req, res) => {
    const { preferences } = req.body; 
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        user.preferences = preferences;  
        await user.save();

        const returnPayload = { id: user._id, username: user.username, preferences: user.preferences, queries: user.queries }

        // Create the new token
        const newToken = jwt.sign(returnPayload, secretKey, { expiresIn: '1h' });

        res.json({ message: 'Preferences updated successfully', token: newToken, user: returnPayload });
    } catch (error) {
        res.status(500).json({ error: 'Error updating preferences' });
    }
});

// Update Past Query Route
router.patch('/queries', verifyToken, async (req, res) => {
    const { queries } = req.body; 
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        user.queries = queries; 
        await user.save();

        const returnPayload = { id: user._id, username: user.username, preferences: user.preferences, queries: user.queries }

        // Create the new token
        const newToken = jwt.sign(returnPayload, secretKey, { expiresIn: '1h' });

        res.json({ message: 'Queries updated successfully', token: newToken, user: returnPayload });
    } catch (error) {
        res.status(500).json({ error: 'Error updating queries' });
    }
});

router.post('/delete', verifyToken, async (req, res) => {
    const { password } = req.body;
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).send('User not found');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send('Invalid credentials');
        }

        await User.findByIdAndDelete(req.user.id);

        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting user' });
    }
});

module.exports = router;
