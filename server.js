import 'dotenv/config.js'
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import mongoose from 'mongoose'
import userRoutes from './routes/user.js'
import passportUtil from './utils/passport.js'

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
app.set('trust proxy', true)
app.use(
    cors({
        origin: process.env.CLIENT_URL,
        credentials: true,
    })
)

passportUtil(app)

app.use('/user', userRoutes)
