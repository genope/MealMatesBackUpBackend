import mongoose from 'mongoose'

const Schema = mongoose.Schema
const Proposition = Schema(
    {
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        location: {
            type: {
                type: String,
                enum: ['Point'],
            },
            coordinates: {
                type: [Number],
                index: '2dsphere',
            },
        },
        propostiondDate: { type: String },
        propostionStatus: {
            type: String,
            default: 'pending',
            enum: ['pending', 'accepted', 'rejected'],
        },
        mates: { type: String },
        restaurantPlaceId: { type: String },
        restaurantName: { type: String },
        restaurantAddress: { type: String },
        restaurantImages: [{ type: String }],
        userRatingsTotal: { type: Number },
    },
    { timestamps: true }
)

export default mongoose.model('Proposition', Proposition)
