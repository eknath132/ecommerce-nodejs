
const admin = true

export const verifyAdmin = (req, res, next) => {
    if(!admin) {
        res.json({error: `-1 ruta ${req.originalUrl} metodo ${req.method} no autorizada`})
        return
    }
    next()
}
