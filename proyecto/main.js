const express = require('express')
const contenedor = require('./classProducto')
const fs = require('fs')

const app = express()
const routerProducto = express.Router()
const PORT = 8080

const productos = new contenedor('productos')

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use('/static',express.static(__dirname + '/public'))

// Middleware
async function productoExistente (req, res, next) {
    try {
        if( fs.existsSync(`./productos.txt`)) {
            const {id} = req.params
            const archivos = await fs.promises.readFile(`./productos.txt`, 'utf-8')
            const productoJson = JSON.parse(archivos)
            const productoEncontrado = productoJson.find(archivo => archivo.id === parseInt(id))
            if(!productoEncontrado) {
                res.json({error: 'No existe el producto'})
                return;
            }
            req.productoExistente = productoEncontrado
            req.productosJson = productoJson
            next()
        }else {
            res.json({error: 'No existe la carpeta de productos'})
            return;
        }
    } catch (error) {
        throw new Error(error)
    }
}


routerProducto.get('/', async( req, res) => { 
    try {
        const allProducts = await productos.getAll()
        if(allProducts.length === 0) {
            res.json({error: 'No hay productos'})
            return
        }
        res.json(allProducts)
    } catch (error) {
        throw new Error(error)
    }
})

routerProducto.get('/:id', productoExistente, async( req, res ) => { 
    try {
        const {productoExistente} = req
        res.json({productoExistente})
    } catch (error) {
        throw new Error(error)
    }
})

routerProducto.put('/:id', productoExistente, async( req, res ) => {
    const productoBuscado = await productos.update( req.body , req?.productoExistente, req?.productosJson )
    res.json(productoBuscado)
})

routerProducto.post('/', async( req, res ) => {
    try{
        const success = await productos.save(req.body)
        res.json(success)
    } catch (error) {
        throw new Error('Error, ' + error)
    }
})

routerProducto.delete('/:id', productoExistente , async( req, res ) => {
    try{
        const { id } = req.productoExistente
        const deleteProducto = await productos.deleteById(req.productosJson ,id)
        res.json({deleteProducto})
    } catch (error) {
        throw new Error(error)
    }
})


app.use('/api/productos',  routerProducto)

app.listen(PORT, () => {
    console.log('Escuchando en el puerto: ' + PORT)
})


