import session from 'cookie-session'
import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'

const passportUtil = (app) => {
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

    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.CLIENT_ID,
                clientSecret: process.env.CLIENT_SECRET,
                callbackURL: '/user/auth/google/callback',
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
}

export default passportUtil
