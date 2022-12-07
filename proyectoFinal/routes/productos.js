const { Router } = require('express')
const { getProductosId, postProductos, putProducto ,deleteProductos } = require('../controllers/productos')
const verifyAdmin = require('../middleware/index')
const router = Router()

router.get('/:id?', getProductosId )
router.post('/', verifyAdmin , postProductos)
router.put('/:id', verifyAdmin, putProducto)
router.delete('/:id', deleteProductos)

module.exports = router;