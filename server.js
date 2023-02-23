
import express from 'express'
import { Server as HttpServer } from 'http'
import { Server as Socket } from 'socket.io'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import testRoute from './router/testRoute.js'
import ProductsMock from './api/productsFaker.js'
import Messages from './api/messages.js'
import normalizeMessages from './normalize/normalize.js'
import config from './config.js'
import userLogin from './router/userLogin.js'
import homeRoute from './router/homeRoute.js'
import { engine } from 'express-handlebars'
import passport from 'passport'
import userReg from './router/userReg.js'
import path from 'path'
import {fileURLToPath} from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const app = express()
const httpServer = new HttpServer(app)
const io = new Socket(httpServer)
const randomProducts = new ProductsMock()
const messages = new Messages()

app.engine('hbs',
    engine({
        extname: '.hbs',
        defaultLayout: false,
        layoutsDir: __dirname + '/views'
    })
)
app.set('view engine', 'hbs')
app.set('views', './public/views')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use('/api/productos-test', testRoute)
app.use(session({
    store: MongoStore.create({
        dbName: 'sessions',
        mongoUrl: config.mongoUrl,
        mongoOptions: {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }}),
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
        // Tiempo de expiración 10 min
        maxAge: 600000
    }
}))

passport.serializeUser((user, done) => {
    done(null, user)
  })
passport.deserializeUser((user, done) => {
    done(null, user)
})

app.use(passport.initialize())
app.use(passport.session())
app.use(userLogin)
app.use(userReg)
app.use(homeRoute)

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
