const express = require('express');
const Messages = require('../models/Messages');


const router = express.Router();

// Ruta para enviar un mensaje
router.post('/', async (req, res) => {
    try {
        const { from_user_id, to_user_id, message } = req.body;

        const newMessage = new Messages({
            from_user_id,
            to_user_id,
            message
        });

        const savedMessage = await newMessage.save();

        res.status(201).json(savedMessage);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Ruta para obtener todos los mensajes
router.get('/', async (req, res) => {
    try {
        const messages = await Messages.find();

        res.status(200).json(messages);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;

// // Get Messages by from_userId and to_userId
// app.get('/messages', async (req, res) => {
//     const { userId, correspondingUserId } = req.query;

//     try {
//         await connectDB();
//         const database = client.db('tinder-data')
//         const messages = database.collection('messages')

//         const query = {
//             from_userId: userId, to_userId: correspondingUserId
//         }
//         const foundMessages = await messages.find(query).toArray()
//         res.send(foundMessages)
//     } finally {
//         await client.close()
//     }
// })

// // Add a Message to our Database
// app.post('/message', async (req, res) => {
//     const message = req.body.message;

//     try {
//         await connectDB();
//         const database = client.db('tinder-data')
//         const messages = database.collection('messages')

//         const insertedMessage = await messages.insertOne(message)
//         res.send(insertedMessage)
//     } finally {
//         await client.close()
//     }
// })