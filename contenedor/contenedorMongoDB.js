
import { MongoClient } from 'mongodb'

const url = 'mongodb+srv://mocks:mocks@cluster0.islzmfm.mongodb.net/?retryWrites=true&w=majority'
const client = new MongoClient(url)
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