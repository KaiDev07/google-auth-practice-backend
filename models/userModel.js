import { Schema as _Schema, model } from 'mongoose'
import { validateRefreshToken, findToken } from './tokenModel'

const Schema = _Schema

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
    provider: {
        type: String,
    },
})

userSchema.statics.refresh = async function (refreshToken) {
    if (!refreshToken) {
        throw Error('User is not authorized')
    }
    const userData = validateRefreshToken(refreshToken)
    const tokenFromDb = await findToken(refreshToken)

    if (!userData || !tokenFromDb) {
        throw Error('User is not authorized')
    }

    const user = await this.findById(userData.id)

    return user
}

export default model('User', userSchema)
