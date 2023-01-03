import Restaurant from '../Models/restaurant.model.js'

export const getRestaurantById = async (id) => {
    return await Restaurant.findById(id)
}

export const getRestaurant = async () => {
    return await Restaurant.find()
}

export const addRestaurant = async (userBody) => {
    return await Restaurant.create(userBody)
}

export const updateRestaurant = async (id, updatebody) => {
    const restaurant = await getRestaurantById(id)
    if (!restaurant) {
        throw new Error('no restaurant found')
    }
    Object.assign(restaurant, updatebody)
    return await restaurant.save()
}

export async function deleteRestaurant(id) {
    if (!id) {
        throw new Error('no id found')
    }
    return await Restaurant.findOneAndDelete({ _id: id })
}
