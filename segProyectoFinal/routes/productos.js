import { Router } from 'express'
import { getProductosId, postProductos, putProducto ,deleteProductos } from '../controllers/productos.js'

import {verifyAdmin} from '../middleware/index.js'

export const productoRouter = Router()

productoRouter.get('/:id?', getProductosId )
productoRouter.post('/', verifyAdmin , postProductos)
productoRouter.put('/:id', verifyAdmin, putProducto)
productoRouter.delete('/:id', deleteProductos)

// export default router;