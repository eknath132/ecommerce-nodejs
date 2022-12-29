import { Router } from 'express'
import { postCarrito, getCarritoProductos, postCarritoProductos, deleteCarritoProductos, deleteCarrito } from '../controllers/carrito.js'
 
export const routerCarrito = Router()

routerCarrito.delete( '/:id?', deleteCarrito )
routerCarrito.post( '/', postCarrito )
routerCarrito.get( '/:id/productos', getCarritoProductos )
routerCarrito.post( '/:id/productos', postCarritoProductos )
routerCarrito.delete( '/:id/productos/:id_prod', deleteCarritoProductos )
