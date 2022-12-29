import { Router } from'express'
import {productoRouter} from './productos.js'
import {routerCarrito} from'./carrito.js'

const router = Router()

router.use('/api/productos', productoRouter)
router.use('/api/carrito', routerCarrito)
router.use('*', (req ,res) => {
    res.json({error: `-2 ruta ${req.originalUrl} metodo ${req.method} no implementada`})
})

export default router;
