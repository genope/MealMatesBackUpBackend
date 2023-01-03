import mongoose from 'mongoose'

const Schema = mongoose.Schema
const Restaurant = Schema(
    {
        name: {
            type: String,
            required: 'This field is required!',
        },
        address: {
            type: String,
            required: 'This field is required!',
        },
        email: {
            type: String,
            required: 'This field is required!',
            unique: true,
        },
        phone: {
            type: String,
            required: 'This field is required!',
        },
        description: {
            type: String,
            required: 'this field is required!',
        },
        Verified: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
)

export default mongoose.model('Restaurant', Restaurant)
