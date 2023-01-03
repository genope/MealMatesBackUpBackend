import express from 'express'
import {
    addProposition,
    updateProposition,
    deleteProposition,
    getProposition,
    getPropositions,
} from '../Controllers/proposition.controller.js'
import { checkCurrentUser } from '../middlewares/verifyToken.js'

const router = express.Router()

router.route('/').get(getPropositions)

router.route('/:id').get(getProposition)

router.route('/add').post(checkCurrentUser, addProposition)

router.route('/update/:id').patch(updateProposition)

router.route('/delete/:id').delete(deleteProposition)

export default router
