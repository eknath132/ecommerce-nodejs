import ContenedorProducto from '../clases/ContenedorMongo.js'

const ProductoClass = new ContenedorProducto()

export const getProductosId = async( req, res ) => {
    try {
        const { id } = req.params
        // Si existe un ID, va a buscar el producto, caso contrario devuelve todos los productos
        if( id ) {
            const productoEncontrado = await ProductoClass.findProducto(id)
            res.json(productoEncontrado)
            return
        }
        const productosAll = await ProductoClass.getAllProductos()
        res.json({productosAll})
        return
    } catch (error) {
        res.send('Id no encontrado')
    }
}

export const postProductos = async( req, res ) => {
    try {
        const obj = req.body
        const creado = await ProductoClass.createProducto(obj)
        console.log('Producto creado correctamente')
        res.json({productoCreado: creado})
    } catch (error) {
        throw error
    }
}

export const putProducto = async( req, res ) => {
    try {
        const {id} = req.params
        const body = req.body
        
        await ProductoClass.updateProducto(id, body)
        console.log('Producto editado correctamente')
        res.json({productoEditado: body})
    } catch (error) {
        console.log(error)
    }
}

export const deleteProductos = async( req, res ) => {
    try {
        const { id } = req.params
        await ProductoClass.deleteProducto(id)
        console.log('Producto eliminado')
        res.json({eliminado: id})
    } catch (error) {
        throw error
    }
}