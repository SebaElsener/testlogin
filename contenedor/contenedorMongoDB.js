
import { MongoClient } from 'mongodb'
import config from '../config.js'

const client = new MongoClient(config.mongoUrl)
const db = client.db('mocks')

class ContenedorMongoDB {
    
    constructor (collection) {
        this.newCollection = db.collection(collection)
    }

    async getAll () {
        try {
            return await this.newCollection.find().toArray()
        } catch (error) {
            console.log('Error al leer la base de datos', error)
        }
    }

    async save (item) {
        try {
            await this.newCollection.insertOne(item)
        } catch (error) {
            console.log(`Error al escribir en base de datos, ${error}`)
        }
    }

}

export default ContenedorMongoDB