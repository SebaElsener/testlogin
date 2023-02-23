
import { Router } from 'express'
import passport from 'passport'
import { Strategy } from 'passport-local'
import bcrypt from 'bcrypt'
import ContenedorMongoDB from '../contenedor/contenedorMongoDB.js'

const users = new ContenedorMongoDB('users')
const userLogin = new Router()
const isValidPassword = async (dbPassword, loginPassword) => {
    return await bcrypt.compare(loginPassword, dbPassword)
}

passport.use('login', new Strategy(
    async (username, password, done) => {
        const user = await users.getByUser(username)
        if (!user) {
            console.log('Usuario no existe')
            return done(null, false)
        }
        const validPassword = await isValidPassword(user[0].password, password)
        if (!validPassword) {
            console.log('Clave no válida')
            return done(null, false)
        }
        const userObject = {
            user: user[0].user,
        }
        return done(null, userObject)
    })
)

userLogin.get('/login', (req, res) => {
    res.render('login')
})

userLogin.get('/logout', (req, res) => {
    req.session.destroy(error => {
        !error
            ? res.render('logout')
            : res.redirect('/home')
    })
})

userLogin.post('/userlogin', passport.authenticate('login', {
    successRedirect: '/home',
    failureRedirect: '/faillogin'
}))

userLogin.get('/faillogin', (req, res) => {
    res.render('faillogin')
})

export default userLogin