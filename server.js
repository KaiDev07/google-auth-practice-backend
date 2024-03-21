require('dotenv').config()
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose')
const userRoutes = require('./routes/user')

const app = express()

mongoose
    .connect(process.env.DB_URI)
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log('connected to db & listening to port', process.env.PORT)
        })
    })
    .catch((err) => console.log(err))

app.use(express.json())
app.use(cookieParser())
app.use(
    cors({
        credentials: true,
        origin: process.env.CLIENT_URL,
    })
)

app.use('/user', userRoutes)
