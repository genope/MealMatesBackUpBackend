import express from 'express'
import { check } from 'express-validator'
import {
    recover,
    reset,
    resetPassword,
} from '../Controllers/password.controller.js'

const router = express.Router()

router.get('/', (req, res) => {
    res.status(200).json({
        message:
            'You are in the Auth Endpoint. Register or Login to test Authentication.',
    })
})

//Password RESET
router.post(
    '/recover',
    [check('email').isEmail().withMessage('Enter a valid email address')],
    recover
)

router.get('/reset/:token', reset)

router.post(
    '/reset/:token',
    [
        check('password')
            .not()
            .isEmpty()
            .isLength({ min: 6 })
            .withMessage('Must be at least 6 chars long'),
        check('confirmPassword', 'Passwords do not match').custom(
            (value, { req }) => value === req.body.password
        ),
    ],
    resetPassword
)

export default router
