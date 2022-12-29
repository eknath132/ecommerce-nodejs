import ContenedorCarrito from '../clases/ContenedorFirebase.js'
import ContenedorProducto from '../clases/ContenedorMongo.js'

const CarritoClass = new ContenedorCarrito()
const ProductoClass = new ContenedorProducto()

export const deleteCarrito = async( req, res ) => {
    try {
        const { id } = req.params
        await CarritoClass.deleteCarrito(id)
        res.json({eliminado: 'ok'})
    } catch (error) {
        throw error
    }
}

export const postCarrito = async( _, res ) => {
    try {
        await CarritoClass.addCarrito()
        console.log('Carrito agregado')
        res.json({agregado: 'Se agrego carrito con exito'})
    } catch (error) {
        throw error
    }
}

export const getCarritoProductos = async( req, res ) => {
    try {
        const { id } = req.params
        if( !id ) {
            res.send('No se envio un id')
        }
        const carritos = await CarritoClass.getCarritoId(id)
        res.json(carritos)
        return
    } catch (error) {
        throw error
    }
}

export const postCarritoProductos = async( req, res ) => {
    try {
        const {id} = req.params
        const productoId = req.body.productosid
        const productoEncontrado = await ProductoClass.findProducto(productoId)
        await CarritoClass.postProductoinCarrito(id, productoEncontrado)
        res.json({producto: 'agregado'})
    } catch (error) {
        throw error
    }
}

export const deleteCarritoProductos = async( req, res ) => {
    try {

        const {id, id_prod} = req.params
        await CarritoClass.deleteProductoinCarrito(id, id_prod)
        res.json({eliminado: 'ok'})
    } catch (error) {
        throw error
    }
}
