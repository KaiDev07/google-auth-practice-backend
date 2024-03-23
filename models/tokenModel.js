import { Schema as _Schema, model } from 'mongoose'
import { verify } from 'jsonwebtoken'

const Schema = _Schema

const tokenSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    refreshToken: {
        type: String,
        required: true,
    },
})

tokenSchema.statics.savetoken = async function (userId, refreshToken) {
    const tokenData = await this.findOne({ user: userId })
    if (tokenData) {
        tokenData.refreshToken = refreshToken
        return tokenData.save()
    }
    const token = await this.create({ user: userId, refreshToken })

    return token
}

tokenSchema.statics.validateRefreshToken = function (token) {
    try {
        const userData = verify(token, process.env.JWT_REFRESH_SECRET)
        return userData
    } catch (error) {
        return null
    }
}

tokenSchema.statics.findToken = async function (refreshToken) {
    const tokenData = await this.findOne({ refreshToken })

    return tokenData
}

export default model('Token', tokenSchema)
