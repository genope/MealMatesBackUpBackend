import express from 'express'
import {
    Register,
    login,
    verifiedUrl,
    verifyUrl,
} from '../Controllers/user.controller.js'
const router = express.Router()

router.route('/')

router.route('/register').post(Register)

router.route('/verified').get(verifiedUrl)
router.route('/verify/:userId/:uniqueString').get(verifyUrl)
router.route('/login').post(login)

export default router
