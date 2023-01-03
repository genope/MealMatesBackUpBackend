import express from 'express'
import { getPlacesByLocation } from '../Controllers/places.controller.js'

const router = express.Router()

router.route('/').get(getPlacesByLocation)
export default router
