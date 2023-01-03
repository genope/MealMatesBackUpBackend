import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
const Schema = mongoose.Schema

const UserVerification = Schema(
    {
        userId: {
            type: String,
        },
        uniqueString: {
            type: String,
        },

        createdAt: {
            type: Date,
        },
        expiresAt: {
            type: Date,
        },
    },
    { timestamps: true }
)

export default mongoose.model('UserVerification', UserVerification)
