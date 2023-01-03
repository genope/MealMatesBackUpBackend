import User from '../models/user.model.js'
import UserVerification from '../models/UserVerification.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import sgMail from '@sendgrid/mail'
import { v4 as uuidv4 } from 'uuid'
import path from 'path'
import {} from 'dotenv/config'
import { fileURLToPath } from 'url'

export function verifyUrl(req, res) {
    console.log('verifyUrl')
    let { userId, uniqueString } = req.params
    UserVerification.find({ userId })
        .then((result) => {
            if (result.length > 0) {
                const { expiresAt } = result[0]
                const hashedUniqueString = result[0].uniqueString
                if (expiresAt < Date.now()) {
                    UserVerification.deleteOne({ userId })
                        .then((result) => {
                            User.deleteOne({ _id: userId })
                                .then(() => {
                                    let message = 'link expired'
                                    res.redirect(
                                        `/user/verified/error=true&message=${message}`
                                    )
                                })
                                .catch((error) => {
                                    let message = 'clearing failed'
                                    res.redirect(
                                        `/user/verified/error=true&message=${message}`
                                    )
                                })
                        })
                        .catch((error) => {
                            console.log(error)
                            let message = 'error'
                            res.redirect(
                                `/user/verified/error=true&message=${message}`
                            )
                        })
                } else {
                    bcrypt
                        .compare(uniqueString, hashedUniqueString)
                        .then((result) => {
                            if (result) {
                                console.log('verified')
                                User.updateOne(
                                    { _id: userId },
                                    { Verified: true }
                                )
                                    .then(() => {
                                        UserVerification.deleteOne({ userId })
                                            .then(() => {
                                                const views = fileURLToPath(
                                                    import.meta.url
                                                )
                                                const __dirname =
                                                    path.dirname(views)
                                                res.sendFile(
                                                    path.join(
                                                        __dirname,
                                                        './../Views/verified.html'
                                                    )
                                                )
                                            })
                                            .catch((error) => {
                                                let message =
                                                    'kenet bech ta5tef '
                                                res.redirect(
                                                    `/user/verified/error=true&message=${error}`
                                                )
                                            })
                                    })
                                    .catch((error) => {
                                        console.log(error)
                                        let message = 'Error '
                                        res.redirect(
                                            `/user/verified/error=true&message=${message}`
                                        )
                                    })
                            } else {
                                let message = 'invalid '
                                res.redirect(
                                    `/user/verified/error=true&message=${message}`
                                )
                            }
                        })
                        .catch((error) => {
                            let message = 'error jena '
                            res.redirect(
                                `/user/verified/error=true&message=${message}`
                            )
                        })
                }
            } else {
                let message = 'ya activitou ya mech mawjoud sorry pal '
                res.redirect(`/user/verified/error=true&message=${message}`)
                res.status(200).json({ message: res })
            }
        })
        .catch((error) => {
            console.log(error)
            let message = 'error'
            res.redirect(`/user/verified/error=true&message=${message}`)
        })
}

export function verifiedUrl(req, res) {
    console.log(__dirname)
    res.sendFile(path.join(__dirname, './../Views/verified.html'))
}
export function sendVerificationMail({ _id, email }, res) {
    const uniqueString = uuidv4() + _id
    const url = `https://mealmate.azurewebsites.net/user/verify/`

    sgMail.send({
        to: email,
        from: process.env.FROM_EMAIL,
        subject: 'Verify Account',
        html: `Click <a href = '${
            url + _id + '/' + uniqueString
        }'>here</a> to confirm your email.`,
        function(error) {
            if (error) {
                console.log(error)
            }
        },
    })
    const saltRounds = 10
    bcrypt.hash(uniqueString, saltRounds).then((hashedUniqueString) => {
        const userVerification = new UserVerification({
            userId: _id,
            uniqueString: hashedUniqueString,
            createdAt: Date.now(),
            expiresAt: Date.now() + 3600000,
        })
        userVerification.save()
    })
}

export function Register(req, res) {
    const { email } = req.body

    const newuser = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        phone: req.body.phone,
        sexe: req.body.sexe,
    })

    newuser
        .save()
        .then((result) => {
            res.status(201).send(newuser)
            sendVerificationMail(result, res)
        })
        .catch((err) => {
            res.status(403).json({ msg: err })
        })
}

export function login(req, res) {
    const email = req.body.email
    const password = req.body.password

    const query = { email }
    //Check the admin exists
    User.findOne(query, (err, user) => {
        console.log(user)
        //Error during exuting the query
        if (err) {
            return res.send({
                success: false,
                message: 'Error, please try again',
            })
        }

        //No admin match the search condition
        if (!user) {
            return res.send({
                success: false,
                message: 'Error, Account not found',
            })
        }

        //Check if the password is correct
        user.isPasswordMatch(password, user.password, (err, isMatch) => {
            //Invalid password
            if (!isMatch) {
                return res.send({
                    success: false,
                    message: 'Error, Invalid Password',
                })
            }

            //admin is Valid

            //const ONE_WEEK = 604800; //Token validtity in seconds

            //Generating the token
            const token = jwt.sign(
                { user },
                process.env.ACCESS_TOKEN_SECRET_KEY
            )

            //admin Is Valid
            //This object is just used to remove the password from the retuned fields

            if (user.verified === false) {
                return res.status(403).send({
                    message: 'Verify your Account.',
                })
            }

            //Send the response back
            return res.send({
                success: true,
                message: 'You can login now',
                user,
                token,
            })
        })
    })
}
