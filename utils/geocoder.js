import NodeGeocoder from 'node-geocoder'

export const options = {
    provider: process.env.GEOCODER_PROVIDER,
    httpAdapter: 'https',
    apiKey: process.env.GEOCODER_API_KEY,
    formatter: null,
}

export const geocoder = NodeGeocoder(options)
