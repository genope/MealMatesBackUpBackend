import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
// Schema Definition
//TODO: Assignment: Add Validate rule for email to be unique

const adminSchema = mongoose.Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
})

//Pre Save Hook. Used to hash the password
adminSchema.pre('save', function (next) {
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
adminSchema.methods.isPasswordMatch = function (
    plainPassword,
    hashed,
    callback
) {
    bcrypt.compare(plainPassword, hashed, (err, isMatch) => {
        if (err) {
            return callback(err)
        }
        callback(null, isMatch)
    })
}

export default mongoose.model('Admin', adminSchema)
