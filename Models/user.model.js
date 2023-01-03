import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'
const Schema = mongoose.Schema
const UserRestaurantInterests = Schema(
    // UserRestaurantInterests
    {
        outdoor: {
            type: Boolean,
            required: true,
        },
        foodCategorys: {
            type: [String],
            required: true,
        },
        priceRange: {
            type: [Number],
            required: true,
            default: [0, 100],
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        cuisineType: {
            type: [String],
            required: true,
            default: ['All'],
        },
    }
)
const cuisineType = [
    'All',
    'African',
    'American',
    'British',
    'Caribbean',
    'Chinese',
    'European',
    'Indian',
    'Italian',
    'Japanese',
    'Tunisien',
]

const User = Schema(
    {
        username: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
        },
        Sexe: {
            type: String,
        },
        age: { type: Number },
        phone: {
            type: String,
            required: true,
        },

        Verified: {
            type: Boolean,
            default: false,
        },
        resetPasswordToken: {
            type: String,
            required: false,
        },

        resetPasswordExpires: {
            type: Date,
            required: false,
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
        userInterests: UserRestaurantInterests,
    },
    { timestamps: true }
)

User.pre('save', function (next) {
    if (!this.isModified('password')) {
        return next()
    }

    //Generate Salt Value
    bcrypt.genSalt(10, (err, salt) => {
        if (err) {
            return next(err)
        }
        //Use this salt value to hash password
        bcrypt.hash(this.password, salt, (err, hash) => {
            if (err) {
                return next(err)
            }
            this.password = hash
            next()
        })
    })
})

//Custom method to check the password correct when login
User.methods.isPasswordMatch = function (plainPassword, hashed, callback) {
    bcrypt.compare(plainPassword, hashed, (err, isMatch) => {
        if (err) {
            return callback(err)
        }
        callback(null, isMatch)
    })
}

//generate usertoken expire in 1hour
User.methods.generatePasswordReset = function () {
    this.resetPasswordToken = crypto.randomBytes(20).toString('hex')
    this.resetPasswordExpires = Date.now() + 3600000 //expires in an hour
}

User.methods.generateJWT = function () {
    const today = new Date()
    const expirationDate = new Date(today)
    expirationDate.setDate(today.getDate() + 60)

    let payload = {
        id: this._id,
        email: this.email,
        username: this.username,
    }
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: parseInt(expirationDate.getTime() / 1000, 10),
    })
}

export default mongoose.model('User', User)
