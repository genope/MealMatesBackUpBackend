import express from 'express'
import {
    addRestaurant,
    updateRestaurant,
    deleteRestaurant,
    getRestaurant,
    getRestaurants,
} from '../Controllers/restaurant.controller.js'

import { upload } from '../middlewares/muterImage.js'

const router = express.Router()

router.route('/').get(getRestaurants)

router.route('/:id').get(getRestaurant)

//router.route('/add').post(upload.single('image'), addRestaurant)
router.route('/add').post(addRestaurant)
router.route('/update/:id').patch(updateRestaurant)

router.route('/delete/:id').delete(deleteRestaurant)

export default router
