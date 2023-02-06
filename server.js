
import express from 'express'
import { Server as HttpServer } from 'http'
import { Server as Socket } from 'socket.io'
import testRoute from './router/testRoute.js'
import ProductsMock from './api/productsFaker.js'
import Messages from './api/messages.js'
import normalizeMessages from './normalize/normalize.js'

const app = express()
const httpServer = new HttpServer(app)
const io = new Socket(httpServer)
const randomProducts = new ProductsMock()
const messages = new Messages()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use('/api/productos-test', testRoute)

io.on('connection', async socket => {
    console.log('Nuevo cliente conectado!')
    // Envío listado completo de productos a todos los clientes conectados
    io.sockets.emit('productsTable', await randomProducts.getAll())

    // ------------------------------------------- //

    // Envío listado completo de mensajes a todos los clientes conectados
    io.sockets.emit('allMessages', {
        normalizedMessages: normalizeMessages(await messages.getAll()),
        originalDataLength: JSON.stringify(await messages.getAll()).length
    })

    // Escuchando y guardando nuevos mensajes
    socket.on('newMessage', async data => {
        data.date = new Date().toLocaleString()
        await messages.save(data)
        io.sockets.emit('allMessages', {
            normalizedMessages: normalizeMessages(await messages.getAll()),
            originalDataLength: JSON.stringify(await messages.getAll()).length
        })
    })

})

const PORT = 8080
const connectedServer = httpServer.listen(PORT, function () {
    console.log(`Servidor Http con Websockets escuchando en el puerto ${connectedServer.address().port}`)
})
connectedServer.on('error', error => console.log(`Error en servidor ${error}`))
