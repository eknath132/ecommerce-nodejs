const { Router } = require('express')
const { deleteCarrito, postProductos, getCarritoProductos, postCarritoProductos, deleteCarritoProductos } = require('../controllers/carrito')
const verifyAdmin = require('../middleware/index')
const router = Router()

router.delete( '/:id?', deleteCarrito )
router.post( '/', postProductos )
router.get( '/:id/productos', getCarritoProductos )
router.post( '/:id/productos', postCarritoProductos )
router.delete( '/:id/productos/:id_prod', deleteCarritoProductos )


module.exports = router;