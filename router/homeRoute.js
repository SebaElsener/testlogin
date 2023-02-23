
import { Router } from 'express'
import userLoginWatcher from '../utils/userLoginWatcher.js'

const homeRoute = new Router()

homeRoute.get('/home', userLoginWatcher, (req, res) => {
    const userName = req.session.passport.user.user
    res.render('index', { user: userName })
})

export default homeRoute