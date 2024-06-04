const PORT = 4000
const express = require('express')
const {MongoClient} = require('mongodb')
const {v4: uuidv4} = require('uuid')
const jwt = require('jsonwebtoken')
const cors = require('cors')
const bcrypt = require('bcrypt')
require('dotenv').config()

const uri = process.env.MONGO_URI

const app = express()
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.json('Hello to my app')
})

// Sign up as new user to the Database

app.post('/signup', async (req, res) => {

    const client = new MongoClient(uri)
    const { email, password } = req.body

    const generatedUserId = uuidv4()
    const hashedPassword = await bcrypt.hash(password, 10)

    try {
        // conexion a la db
        await client.connect()
        // pongo el nombre de mi db y coleccion, si pongo otra crea otra
        const database = client.db('tinder-data')
        const users = database.collection('users')
        // Verifico si ya existe uno
        const existingUser = await users.findOne({ email })
        if (existingUser) {
            return res.status(409).send('User already exists. Please login')
        }
        const sanitizedEmail = email.toLowerCase()

        //  creo la data nueva, para guardar en db
        const data = {
            user_id: generatedUserId,
            email: sanitizedEmail,
            hashed_password: hashedPassword
        }

        const insertedUser = await users.insertOne(data)

        // uso jwt para generar el token de usuario y autenticacion
        const token = jwt.sign(insertedUser, sanitizedEmail, {
            expiresIn: 60 * 24
        })
        res.status(201).json({ token, userId: generatedUserId, email: sanitizedEmail })

    } catch (err) {
        console.log(err)
    } finally {
        await client.close()
    }
});

// Log in to the Database

app.post('/login', async (req, res) => {
    const client = new MongoClient(uri)
    const { email, password } = req.body

    try {
        await client.connect()
        const database = client.db('tinder-data')
        const users = database.collection('users')

        const user = await users.findOne({ email })

        if (user) {
            const correctPassword = await bcrypt.compare(password, user.hashed_password)
            if (correctPassword) {
                const token = jwt.sign(user, email, {
                    expiresIn: 60 * 24
                })
                res.status(201).json({ token, userId: user.user_id })
            }
            else {
                res.status(400).json('Invalid Credentials')
            }
        }

        if (!user) {
            res.status(400).json('User not exists')
        }


    } catch (err) {
        console.log(err)
    } finally {
        await client.close()
    }
});

// Get individual user

app.get('/user', async (req, res) => {
    const client = new MongoClient(uri)
    // busco en base a la peticion que llega en el metodo get, y el id viene en la url userId?....asdhashd etc
    const userId = req.query.userId;

    try {
        await client.connect()
        const database = client.db('tinder-data')
        const users = database.collection('users')

        const query = { user_id: userId }
        // lo busco por el parametro, en este caso id
        const user = await users.findOne(query)
        res.send(user)

    } finally {
        await client.close()
    }
})

// Get all users by any params - to verified its work the server

app.get('/allusers', async (req, res) => {
    const client = new MongoClient(uri);
    try {
        await client.connect();
        const database = client.db('tinder-data');
        const users = database.collection('users');

        const returnedUsers = await users.find().toArray();
        res.send(returnedUsers)
    } finally {
        await client.close()
    }
});



// Update a User in the Database

app.put('/user', async (req, res) => {
    const client = new MongoClient(uri)
    const formData = req.body.formData;

    const day_dob = formData?.dob_day;
    const month_dob = formData?.dob_month;
    const year_dob = formData?.dob_year;

    function calculateAge(day_dob, month_dob, year_dob) {
        // Convertir strings a números
        const day = parseInt(day_dob);
        const month = parseInt(month_dob) - 1; // Meses en JavaScript son 0-11
        const year = parseInt(year_dob);

        // Crear la fecha de nacimiento
        const birthDate = new Date(year, month, day);
        const today = new Date();

        // Calcular la edad
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDifference = today.getMonth() - birthDate.getMonth();

        // Ajustar la edad si el cumpleaños no ha pasado aún este año
        if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        return age;
    }

    const age = calculateAge(day_dob, month_dob, year_dob);

    try {
        await client.connect()
        const database = client.db('tinder-data')
        const users = database.collection('users')

        // Traigo los datos del form , para poder setear el usuario ya creado. 
        const query = { user_id: formData.user_id }

        const updateDocument = {
            $set: {
                first_name: formData.first_name,
                dob_day: formData.dob_day,
                dob_month: formData.dob_month,
                dob_year: formData.dob_year,
                show_gender: formData.show_gender,
                gender_identity: formData.gender_identity,
                gender_interest: formData.gender_interest,
                url: formData.url,
                about: formData.about,
                age: age,
                matches: formData.matches || [],
            },
        }
        // realizo un update de crud, con el documento anterior y el querey del user_id como parametro
        const insertedUser = await users.updateOne(query, updateDocument)

        res.json(insertedUser)

    } finally {
        await client.close()
    }
});


// Get all Users by userIds in the Database

app.get('/users', async (req, res) => {
    const client = new MongoClient(uri);
    // recibe de la ruta el id del usuario que matcheo o cualuiqer usuario
    const userIds = req.query.userIds ? JSON.parse(req.query.userIds) : []

    try {
        await client.connect()
        const database = client.db('tinder-data')
        const users = database.collection('users')

        const pipeline =
            [
                {
                    '$match': {
                        'user_id': {
                            '$in': userIds
                        }
                    }
                }
            ]

        const foundUsers = await users.aggregate(pipeline).toArray()
        res.json(foundUsers)

    } catch (error) {
        console.error('Error connecting to the database:', error);
        res.status(500).send('An error occurred while fetching users.');
    } finally {
        await client.close();
    }
})

// Traigo los generos de los usuarios que son de mi interes
app.get('/gendered-users', async (req, res) => {
    const client = new MongoClient(uri);
    const gender = req.query.gender;

    try {
        await client.connect();
        const database = client.db('tinder-data');
        const users = database.collection('users');

        let query = {};
        if (gender !== 'everyone') {
            query = { gender_identity: { $eq: gender } };
        }

        const foundUsers = await users.find(query).toArray();
        res.json(foundUsers);

    } catch (error) {
        console.error('Error connecting to the database:', error);
        res.status(500).send('An error occurred while fetching users.');
    } finally {
        await client.close();
    }
});

// Update User with a match

app.put('/addmatch', async (req, res) => {
    const client = new MongoClient(uri)
    const { userId, matchedUserId } = req.body

    try {
        await client.connect()
        const database = client.db('tinder-data')
        const users = database.collection('users')

        const query = { user_id: userId }
        const updateDocument = {
            $push: { matches: { user_id: matchedUserId } }
        }
        const user = await users.updateOne(query, updateDocument)
        res.send(user)
    } finally {
        await client.close()
    }
});

// Get Messages by from_userId and to_userId
app.get('/messages', async (req, res) => {
    const {userId, correspondingUserId} = req.query
    const client = new MongoClient(uri)

    try {
        await client.connect()
        const database = client.db('tinder-data')
        const messages = database.collection('messages')

        const query = {
            from_userId: userId, to_userId: correspondingUserId
        }
        const foundMessages = await messages.find(query).toArray()
        res.send(foundMessages)
    } finally {
        await client.close()
    }
})

// Add a Message to our Database
app.post('/message', async (req, res) => {
    const client = new MongoClient(uri)
    const message = req.body.message

    try {
        await client.connect()
        const database = client.db('tinder-data')
        const messages = database.collection('messages')

        const insertedMessage = await messages.insertOne(message)
        res.send(insertedMessage)
    } finally {
        await client.close()
    }
})

// Delete a message of database
app.delete('/message', async (req, res) => {
    const client = new MongoClient(uri)
    console.log(req.query._id)

    try {
        await client.connect()
        const database = client.db('tinder-data')
        const messages = database.collection('messages')

        const deleteMessage = await messages.findOneAndDelete({ _id: req.query?.id })
        res.send(deleteMessage, ' Message deleted')
    } finally {
        await client.close()
    }
})


app.listen(PORT, ()=> console.log('Server running on PORT' + PORT))