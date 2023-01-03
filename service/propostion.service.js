import Proposition from '../Models/proposition.model.js'
import * as placesService from './placesService.js'

export const getPropositionById = async (id) => {
    return Proposition.findById(id)
}

export const addProposition = async (placeId, owner, userbody) => {
    const getRestaurantByPlaceId = await placesService.getNearbyRestaurants(
        placeId
    )
    // const getPhotos = await placesService.getRestaurantImages(
    //     getRestaurantByPlaceId.photos[0].photo_reference
    // )
    const proposition = {
        owner,
        restaurantPlaceId: placeId,
        restaurantAddress: getRestaurantByPlaceId.vicinity,
        // restaurantImages: [getPhotos],
        userRatingsTotal: getRestaurantByPlaceId.user_ratings_total,
        restaurantName: getRestaurantByPlaceId.name,
        // location: {
        //     type: 'Point',
        //     coordinates: [
        //         getRestaurantByPlaceId.geometry.location.lat,
        //         getRestaurantByPlaceId.geometry.location.lng,
        //     ],
        // },
        ...userbody,
    }
    return await Proposition.create(proposition)
}
export const getProposition = async () => {
    return Proposition.find()
}

export const changePropositionStatus = async (id, status) => {
    const proposition = await getPropositionById(id)
    if (!proposition) {
        throw new Error('no proposition found')
    }
    proposition.status = status
    return await proposition.save()
}

export const updateProposition = async (id, updatebody) => {
    const proposition = await getPropositionById(id)
    if (!proposition) {
        throw new Error('no proposition found')
    }

    Object.assign(proposition, updatebody)
    return await proposition.save()
}

export async function deleteProposition(id) {
    if (!id) {
        throw new Error('no id found')
    }
    return await Proposition.findOneAndDelete({ _id: id })
}

// Retrieve posts within a certain radius of a location
export async function getPosts(location, radius, callback) {
    await getProposition
        .find({
            location: {
                $geoWithin: {
                    $centerSphere: [
                        location,
                        radius / 6371, // Convert radius from kilometers to radians
                    ],
                },
            },
        })
        .toArray(function (err, posts) {
            callback(posts)
        })
}
