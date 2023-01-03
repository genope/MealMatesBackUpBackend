import express from 'express'
import mongoose from 'mongoose'
import adminRoutes from './Routes/admin.route.js'
import userRoutes from './Routes/user.route.js'
import restaurantRoutes from './Routes/restaurant.route.js'
import propositionRoutes from './Routes/proposition.route.js'
import restauthRoutes from './Routes/restauth.route.js'
import placesRoutes from './Routes/places.route.js'
import * as placesService from './service/placesService.js'

import * as dotenv from 'dotenv'
import bodyParser from 'body-parser'
import path from 'path'
import { fileURLToPath } from 'url'
import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
dotenv.config()
const app = express()
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use('/user', userRoutes)
app.use('/admin', adminRoutes)
app.use('/restaurant', restaurantRoutes)
app.use('/proposition', propositionRoutes)
app.use('/places', placesRoutes)
app.use('/restpassword', restauthRoutes)
app.use('/uploadrestaurant', express.static('/uploads'))
const hostname = process.env.DEVURL
const port = process.env.PORT || 8082

mongoose.set('debug', process.env.NODE_ENV === 'dev')
mongoose.Promise = global.Promise
const azureMongoStringUrl = process.env.MONGO_URL
mongoose
    .connect(
        process.env.NODE_ENV === 'dev'
            ? 'mongodb://127.0.0.1/MealMateDB'
            : azureMongoStringUrl
    )
    .then(() => {
        console.log(`Connected to database`)
    })
    .catch((err) => {
        console.log(err)
    })

//for azure ping health check
app.route('/').get((req, res) =>
    res.json({ message: 'Welcome to MealMate Api Server' }).status(200)
)
//SWAGGER
const swaggerOptions = {
    swaggerDefinition: {
        info: {
            title: 'MealMate API',
            description: 'MealMate API Information',
            contact: {
                name: 'MealMate Team aka the one and only Hassen Mabrouk',
            },
            servers: ['https://mealmate.azurewebsites.net'],
        },
    },
    apis: ['./Routes/*.js'],
}
const swaggerDocs = swaggerJSDoc(swaggerOptions)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs))

const views = fileURLToPath(import.meta.url)
const __dirname = path.dirname(views)
app.set('views', path.join(__dirname, 'Views'))
app.set('view engine', 'jade')

//upload image

app.listen(port, async () => {
    console.log(`server running at http://${hostname}:${port}/`)
    const test = await placesService.getPlaceId('Restaurant Sultan')
    console.log(test)
})
