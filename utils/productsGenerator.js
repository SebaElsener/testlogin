
import { faker } from '@faker-js/faker'
faker.locale = 'es'

export const productsGenerator = () => {
    return {
        product: faker.commerce.productName(),
        price: faker.commerce.price(),
        thumbnail: faker.image.image(70, 70)
    }
}