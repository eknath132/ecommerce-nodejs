const fs = require('fs')

const setProductos = async() => {
    const productos = await fs.promises.readFile('./datos/productos.txt', 'utf-8')
    const productosJson = JSON.parse(productos)
    return productosJson
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
const getProductosId = async( req, res ) => {
    try {
        const { id } = req.params
        const productosJson = await setProductos()

        // Si existe un ID, va a buscar el producto, caso contrario devuelve todos los productos
        if( id ) {
            const productoEncontrado = productosJson.find(producto => producto.id === parseInt(id))
            if(!productoEncontrado) {
                res.send('Producto no encontrado')
                return
            }
            res.json(productoEncontrado)
            return
        }
        res.json({productosJson})
        return
    } catch (error) {
        throw error
    }
}

const postProductos = async( req, res ) => {
    try {
        const obj = req.body
        const productosJson = await setProductos()
        const productVerify = verifyInput(obj)

        if( productVerify ) {
            res.send('No se permiten campos vacios')
            return
        }

        if (productosJson.find(producto => producto.codigo == obj.codigo)) {
        res.send('No se puede agregar este producto por que el codigo ya existe')
        return
        }

        // Obtenemos el id mayor
        const idMayor  = Math.max(...productosJson.map(producto => producto?.id))
        const productoNuevo = {...obj, id: idMayor + 1, timestamp: new Date().toLocaleString() }
        productosJson.push(productoNuevo)

        fs.promises.writeFile(`./datos/productos.txt`, JSON.stringify(productosJson, null , 2))
            .then(() =>  res.json(productoNuevo) )
            .catch(() => {throw new Error ('Hubo un error al crearse el producto')})

    } catch (error) {
        throw error
    }
}

const putProducto = async( req, res ) => {
    const {id} = req.params
    const body = req.body

    if(!id) res.send('No se envio el id')

    const productosJson = await setProductos()
    const productoEncontrado = productosJson.find(producto => producto.id == id)
    const productoActualizado = {...productoEncontrado, ...body}

    const nuevoArrayProductos = productosJson.map(producto => {
        if(producto.id === productoActualizado.id) producto = {...producto, ...productoActualizado, timestamp: new Date().toLocaleString()}
        return producto
    })

    return fs.promises.writeFile(`./datos/productos.txt`, JSON.stringify(nuevoArrayProductos, null , 2))
    .then(() => res.json(productoActualizado) )
}


const deleteProductos = async( req, res ) => {
    try {
        const { id } = req.params
        const productosJson = await setProductos()

        // Si existe un ID, va a buscar el producto, caso contrario devuelve todos los productos
        if( !id ) {
            res.send('No se envio un id para eliminar el producto')
            return
        }

        const productoEncontrado = productosJson.find(producto => producto.id === parseInt(id))
        if(!productoEncontrado) {
            res.send('El producto no existe')
            return
        }

        const productoSinEliminar = productosJson.filter(producto => producto.id != id)
        fs.promises.writeFile(`./datos/productos.txt`, JSON.stringify(productoSinEliminar, null , 2))
        .then(() =>  res.send(`Se elimino el producto ${id}`) )
    } catch (error) {
        throw error
    }
}


module.exports = {
    getProductosId,
    postProductos,
    deleteProductos,
    putProducto
}