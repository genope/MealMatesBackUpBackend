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

/**
 * @swagger
 * /proposition:
 *  get:
 *     description: Use to request all propositions
 *     responses:
 *         '200':
 *            description: A successful response
 */
router.route('/').get(getPropositions)

/**
 * @swagger
 * /proposition/{id}:
 *  get:
 *     description: Get a list of proposition by id
 *     responses:
 *         '200':
 *            description: A successful response
 */
router.route('/:id').get(getProposition)

/**
 * @swagger
 * /proposition/add:
 *  post:
 *     description: Add a proposition
 *     responses:
 *         '200':
 *            description: A successful response
 */
router.route('/add').post(checkCurrentUser, addProposition)

router.route('/update/:id').patch(updateProposition)

router.route('/delete/:id').delete(deleteProposition)

export default router
