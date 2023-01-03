import express from 'express'
import { Register, login } from '../Controllers/admin.controller.js'
const router = express.Router()

router.route('/')

router.route('/register').post(Register)

router.route('/login').post(login)

export default router
