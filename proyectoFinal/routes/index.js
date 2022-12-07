const { Router } = require('express')
const productos = require('./productos')
const carrito = require('./carrito')

const router = Router()

router.use('/api/productos', productos)
router.use('/api/carrito', carrito)
router.use('*', (req ,res) => {
    res.json({error: `-2 ruta ${req.originalUrl} metodo ${req.method} no implementada`})

})


module.exports = router;
