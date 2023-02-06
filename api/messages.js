
import ContenedorMongoDB from '../contenedor/contenedorMongoDB.js'

class Messages extends ContenedorMongoDB {

    constructor () {
        super ('messages')
    }

}

export default Messages