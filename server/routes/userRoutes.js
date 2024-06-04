const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const User = require('../models/User');

const router = express.Router();

router.post('/signup', async (req, res) => {
    const { email, password } = req.body;
    console.log(email)

    try {
        // Verifico si ya existe un usuario con el mismo email
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).send('User already exists. Please login.');
        }

        // Crear nuevo usuario
        const sanitizedEmail = email?.toLowerCase();
        const generatedUserId = uuidv4()
        // Hash de la contraseña
        const hashedPassword = 'askdjagywbndlkjahs'

        const newUser = new User({
            user_id: generatedUserId,
            email: sanitizedEmail,
            hashed_password: hashedPassword
        });

        const insertedUser = await newUser.save();

        // uso jwt para generar el token de usuario y autenticacion
        const token = jwt.sign(insertedUser, sanitizedEmail, {
            expiresIn: 60 * 24
        })
        res.status(201).json({ token, userId: generatedUserId, email: sanitizedEmail })

    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

module.exports = router;