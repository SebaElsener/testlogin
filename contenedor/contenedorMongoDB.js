
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
            return item
        } catch (error) {
            console.log(`Error al escribir en base de datos, ${error}`)
        }
    }

    async getByUser (username) {
        try {
            const matchedUser = await this.newCollection.find({ 'user': username }).toArray()
            if (matchedUser.length === 0) {
                return false
            }
            return matchedUser
        } catch (error) {
            console.log(`El usuario ya existe, ${error}`)
        }
    }

}

export default ContenedorMongoDB