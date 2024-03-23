import session from 'cookie-session'
import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'

const passportUtil = (app) => {
    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: process.env.GOOGLE_CALLBACK_URL,
                scope: ['profile', 'email'],
            },
            (accessToken, refreshToken, profile, callback) => {
                callback(null, profile)
            }
        )
    )

    passport.serializeUser((user, done) => {
        done(null, user)
    })
    passport.deserializeUser((user, done) => {
        done(null, user)
    })

    app.use(
        session({
            secret: process.env.SESSION_SECRET,
            resave: false,
            saveUninitialized: false,
            cookie: {
                maxAge: 1000 * 60 * 60 * 24 * 7, //1 week
                httpOnly: true,
                secure: true,
            },
        })
    )

    app.use(passport.initialize())
    app.use(passport.session())
}

export default passportUtil
