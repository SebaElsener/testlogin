
import { Router } from 'express'
import passport from 'passport'
import { Strategy } from 'passport-local'
import bcrypt from 'bcrypt'
import ContenedorMongoDB from '../contenedor/contenedorMongoDB.js'

const users = new ContenedorMongoDB('users')
const userReg = new Router()
const saltRounds = 10
const createHash = async (password) => {
    return await bcrypt.hash(password, saltRounds)
}

passport.use('register', new Strategy({
    passReqToCallback: true},
    async (req, username, password, done) => {
        const user = await users.getByUser(username)
        if (user) {
            console.log('Usuario ya existe')
            return done(null, false)
        }
        const newUser = {
            user: req.body.username,
            password: await createHash(password)
        }
        const savedUser = await users.save(newUser)
        console.log(`Nuevo usuario ${savedUser.user} creado con éxito`)
        return done(null, savedUser)
    }
))

userReg.get('/', (req, res) => {
    res.redirect('/register')
})

userReg.get('/register', (req, res) => {
    res.redirect('/register.html')
})

userReg.post('/register', passport.authenticate('register', {
    successRedirect: '/successreg',
    failureRedirect: '/failreg'
}))

userReg.get('/failreg', (req, res) => {
    res.render('failreg')
})

userReg.get('/successreg', (req, res) => {
    res.render('successreg')
})

export default userReg