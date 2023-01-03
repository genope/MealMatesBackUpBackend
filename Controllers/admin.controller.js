import Admin from '../models/admin.model.js'
import jwt from 'jsonwebtoken'

export function Register(req, res) {
    const newadmin = new Admin({
        email: req.body.email,
        password: req.body.password,
    })

    newadmin.save((err, admin) => {
        if (err) {
            return res.send({
                success: false,
                message: 'Failed to save the admin',
            })
        }
        res.send({
            success: true,
            message: 'admin Saved',
            admin,
        })
    })
}

export function login(req, res) {
    const email = req.body.email
    const password = req.body.password

    const query = { email }
    //Check the admin exists
    Admin.findOne(query, (err, admin) => {
        //Error during exuting the query
        if (err) {
            return res.send({
                success: false,
                message: 'Error, please try again',
            })
        }

        //No admin match the search condition
        if (!admin) {
            return res.send({
                success: false,
                message: 'Error, Account not found',
            })
        }

        //Check if the password is correct
        admin.isPasswordMatch(password, admin.password, (err, isMatch) => {
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
                { admin },
                process.env.ACCESS_TOKEN_SECRET_KEY
            )

            //admin Is Valid
            //This object is just used to remove the password from the retuned fields
            let returnadmin = {
                email: admin.email,
                id: admin._id,
            }

            //Send the response back
            return res.send({
                success: true,
                message: 'You can login now',
                admin: returnadmin,
                token,
            })
        })
    })
}
