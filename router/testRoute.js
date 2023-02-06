
import { Router } from 'express'
import ProductsMock from '../api/productsFaker.js'

const testRoute = new Router()
const randomProducts = new ProductsMock()

testRoute.get('/', async (req, res) => {
    try {
        res.json(await randomProducts.generateRandomProducts(5))
    } catch (error) {
        console.log(`Error al crear productos, ${error}`)
    }
})

export default testRoute