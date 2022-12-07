const fs = require('fs')

const setCarrito = async() => {
    const carrito = await fs.promises.readFile('./datos/carrito.txt', 'utf-8')
    const carritoJson = JSON.parse(carrito)
    return carritoJson
}

const verifyInput = (body) => {
    const inputs = [ 'nombre', 'descripcion', 'codigo', 'foto', 'precio', 'stock' ] 
    let verify = false;

    inputs.forEach(input => {
        if( !body[input] || body[input]?.length == 0 || body[input] == " ") {
            verify = true
        }
    })
    return verify
}
const deleteCarrito = async( req, res ) => {
    try {
        const { id } = req.params
        const carritoJson = await setCarrito()

        // Si existe un ID, va a buscar el producto, caso contrario devuelve todos los carritos
        if( !id ) {
            res.send('No se envio un id para eliminar el producto')
            return
        }

        const nuevoArrayCarrito = carritoJson.filter(carrito => carrito.id != parseInt(id))
        fs.promises.writeFile(`./datos/carrito.txt`, JSON.stringify(nuevoArrayCarrito, null , 2))
            .then(() =>  res.json(nuevoArrayCarrito) )
            .catch(() => {throw new Error ('Hubo un error al crearse el carrito')})

    } catch (error) {
        throw error
    }
}

const postProductos = async( _, res ) => {
    try {
        const carritoJson = await setCarrito()

        // Obtenemos el id mayor
        const idMayor  = Math.max(...carritoJson.map(carrito => carrito?.id))
        const carritoNuevo = {id: idMayor + 1, timestamp: new Date().toLocaleString(), productos: [] }
        carritoJson.push(carritoNuevo)

        fs.promises.writeFile(`./datos/carrito.txt`, JSON.stringify(carritoJson, null , 2))
            .then(() =>  res.json(carritoNuevo) )
            .catch(() => {throw new Error ('Hubo un error al crearse el carrito')})

    } catch (error) {
        throw error
    }
}

const getCarritoProductos = async( req, res ) => {
    try {
        const { id } = req.params
        const carritoJson = await setCarrito()
        // Si existe un ID, va a buscar el producto, caso contrario devuelve todos los carritos
        if( !id ) {
            res.send('No se envio un id')
        }
        const carritoEncontrado = carritoJson.find(carrito => carrito.id === parseInt(id))
        if(!carritoEncontrado) {
            res.send('carrito no encontrado')
            return
        }
        res.json(carritoEncontrado.productos)
        return
    } catch (error) {
        throw error
    }
}

const postCarritoProductos = async( req, res ) => {
    try {
        const {id} = req.params
        const productoId = req.body.productosid
        const producto = await fs.promises.readFile('./datos/productos.txt', 'utf-8')
        const productosJson = JSON.parse(producto)
        const carritoJson = await setCarrito()
        let getProducto = {}
        
        if(!productoId){
            res.send('No se envio el id del producto')
        }

        if( id ) {
            const productoEncontrado = productosJson.find(producto => producto.id === parseInt(productoId))
            if(!productoEncontrado) {
                res.send('Producto no encontrado')
                return
            }
            getProducto = productoEncontrado
        }

        const carritoEncontrado = carritoJson.find(carrito => carrito.id === parseInt(id))
            if(!carritoEncontrado) {
                res.send('carrito no encontrado')
                return
            }
        carritoEncontrado.productos.push(getProducto)
        const nuevoArrayProductos = carritoJson.map(carrito => {
            if(carrito.id === carritoEncontrado.id) carrito = {...carrito, ...carritoEncontrado, timestamp: new Date().toLocaleString()}
            return carrito
        })

        fs.promises.writeFile(`./datos/carrito.txt`, JSON.stringify(nuevoArrayProductos, null , 2))
            .then(() =>  res.json(carritoEncontrado) )
            .catch(() => {throw new Error ('Hubo un error al crearse el carrito')})

    } catch (error) {
        throw error
    }
}

const deleteCarritoProductos = async( req, res ) => {
    try {
        const {id, id_prod} = req.params        
        const carritoJson = await setCarrito()
        
        if(!id_prod){
            res.send('No se envio el id del producto')
            return
        }

        const carritoEncontrado = carritoJson.find(carrito => carrito.id === parseInt(id))
        if(!carritoEncontrado) {
            res.send('carrito no encontrado')
            return
        }
        const productoEliminado =  carritoEncontrado.productos.filter(producto => producto.id != id_prod )
        // console.log('productoEliminado', productoEliminado)
        const nuevoArrayProductos = carritoJson.map(carrito => {
            if(carrito.id == id) carrito = {...carrito, productos: productoEliminado, timestamp: new Date().toLocaleString()}
            return carrito
        })

        fs.promises.writeFile(`./datos/carrito.txt`, JSON.stringify(nuevoArrayProductos, null , 2))
            .then(() =>  res.send('Producto eliminado con exito') )
            .catch(() => {throw new Error ('Hubo un error al crearse el carrito')})

    } catch (error) {
        throw error
    }
}


module.exports = {
    deleteCarrito,
    postProductos,
    getCarritoProductos,
    postCarritoProductos,
    deleteCarritoProductos
    // deleteProductos,
    // putProducto
}