
const userLoginWatcher = (req, res, next) => {
    req.session?.user ? next() : res.render('timeout')
}

export default userLoginWatcher