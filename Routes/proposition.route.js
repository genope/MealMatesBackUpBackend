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
 * /proposition/:
 *   get:
 *     summary: Get a list of propositions
 *     description: Use to request all propositions
 *     responses:
 *       "200":
 */
router.route('/').get(getPropositions)

/**
 * @swagger
 * /proposition/{id}:
 *   post:
 *     summary: Get a list of proposition by id
 *     description: Add a proposition
 *     responses:
 *       "200":
 */
router.route('/:id').get(getProposition)

/**
 * @swagger
 * /proposition/add:
 *   post:
 *     summary: Add a proposition
 *     description: Add a proposition
 *     responses:
 *       "200":
 *
 */
router.route('/add').post(checkCurrentUser, addProposition)

router.route('/update/:id').patch(updateProposition)

router.route('/delete/:id').delete(deleteProposition)

export default router
