import * as placesService from '../service/placesService.js'

export const getPlacesByLocation = async (req, res) => {
    try {
        const places = await placesService.getNearbyRestaurants(req.query)
        if (!places) {
            throw new Error('places not found')
        }
        res.send(places)
    } catch (error) {
        res.status(500).json({ message: error.message, stack: error.stack })
    }
}
