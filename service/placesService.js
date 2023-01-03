import fetch from 'node-fetch'
const GOOGLE_PLACES_API_KEY = 'AIzaSyC9SJL75zPEeFOVDyc3qUFObyzz574zTHk'
export const getCoordinates = async (location) => {
    try {
        const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${location}&key=${GOOGLE_PLACES_API_KEY}`
        const response = await fetch(url)
        const data = await response.json()
        const coordinates = await data.results[0].geometry.location
        return coordinates
    } catch (error) {
        console.log(error)
    }
}

export const getPlaceId = async (restaurantName) => {
    const url = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${restaurantName}&inputtype=textquery&fields=place_id&key=${GOOGLE_PLACES_API_KEY}`
    const response = await fetch(url)
    const data = await response.json()
    return data.candidates[0].place_id
}

export const getRestaurantImages = async (photo_reference) => {
    try {
        const url = `https://maps.googleapis.com/maps/api/place/photo?photo_reference=${photo_reference}&maxheight=400&maxwidth=400&key=${GOOGLE_PLACES_API_KEY}`
        return fetch(url).then((response) => response.url)
    } catch (error) {
        console.log(error)
    }
}
export const getRestaurant = async (placeId) => {
    try {
        const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${GOOGLE_PLACES_API_KEY}`
        const response = await fetch(url)
        const data = await response.json()
        return data.result
    } catch (error) {
        console.log(error)
    }
}

export const getNearbyRestaurants = async ({ lat, lng, radius, keyword }) => {
    try {
        const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lng},${lat}&radius=${radius}&keyword=${keyword}&type=restaurant&key=${GOOGLE_PLACES_API_KEY}` //results dont show restos in shopping malls
        const response = await fetch(url)
        const data = await response.json()

        return data.results.map((element) => ({
            ...element.geometry.location,
            title: element.name,
            id: element.place_id,
        }))
    } catch (error) {
        console.log(error)
    }
}
