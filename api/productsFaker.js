
import { productsGenerator } from '../utils/productsGenerator.js'
import ContenedorMongoDB from '../contenedor/contenedorMongoDB.js'

class ProductsMock extends ContenedorMongoDB {

    constructor () {
        super ('randomProducts')
    }

    async generateRandomProducts (qty) {
        const fakeProductsArray = []
        for (let i=0;i < qty;i++) {
            const newFakeProduct = productsGenerator()
            await this.save(newFakeProduct)
            fakeProductsArray.push(newFakeProduct)
        }
        return fakeProductsArray
    }

}

export default ProductsMock