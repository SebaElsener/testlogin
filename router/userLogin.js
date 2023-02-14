
import { Router } from 'express'


const userLogin = new Router()

userLogin.get('/', (req, res) => {
    res.redirect('/login')
})

userLogin.get('/login', (req, res) => {
    const userName = req.session?.user
    if (userName) {
        res.redirect('/home')
    } else {
        res.redirect('/login.html')
    }
})

userLogin.get('/logout', (req, res) => {
    const userName = req.session?.user
    req.session.destroy(error => {
        !error
            ? res.render('logout', { user: userName })
            : res.redirect('/home')
    })
})

userLogin.post('/userlogin', (req, res) => {
    req.session.user = req.body.userName
    res.redirect('/home')
})

export default userLogin