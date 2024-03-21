const mongoose = require('mongoose')
const Token = require('./tokenModel')

const Schema = mongoose.Schema

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    isActivated: {
        type: Boolean,
        default: false,
    },
    activationLink: {
        type: String,
    },
    name: {
        type: String,
    },
})

userSchema.statics.refresh = async function (refreshToken) {
    if (!refreshToken) {
        throw Error('User is not authorized')
    }
    const userData = Token.validateRefreshToken(refreshToken)
    const tokenFromDb = await Token.findToken(refreshToken)

    if (!userData || !tokenFromDb) {
        throw Error('User is not authorized')
    }

    const user = await this.findById(userData.id)

    return user
}

module.exports = mongoose.model('User', userSchema)
