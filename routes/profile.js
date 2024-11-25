const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { decrypt } = require('../utils/encryption');

const router = express.Router();

router.get('/fetch/users/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found.' });

        const payload = decrypt(user.encryptedPayload);
        const { name } = JSON.parse(payload);
        res.status(200).json({ name });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
