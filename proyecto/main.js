const express = require('express')
const { Server : HttpServer } = require('http')
const { Server: IOServer } = require('socket.io')

const handlebars = require('express-handlebars')
const contenedor = require('./classProducto')
const fs = require('fs')

const app = express()
const httpServer = new HttpServer(app)
const io = new IOServer(httpServer)
const routerProducto = express.Router()
const PORT = 8080

//###### Preparar motor de plantilla handlebars

    app.engine('handlebars', handlebars.engine())
    app.set('views', './handlebars')
    app.set('view engine', 'handlebars')

// ##### cierre motor de plantilla handlebars


// ##### Prepara motor plantilla pug

    // app.set('views', './pug')
    // app.set('view engine', 'pug')

// ##### cierre motor de plantilla pugs

// #### Preparar motor plantilla Ejs
    // app.set('views', './ejs')
    // app.set('view engine', 'ejs')


// ### cierre motor plantilla ejs

const productos = new contenedor('productos')

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static(__dirname + '/public'))

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
            res.render('datos', {productos: []})
            return;
        }
    } catch (error) {
        throw new Error(error)
    }
}


routerProducto.get('/', async( req, res) => { 
    try {
        const productosGet = await productos.getAll()
        res.render('datos', {productos: productosGet || []})
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
        console.log('success', success)
        res.redirect('/api/productos')
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

httpServer.listen(PORT, () => {
    console.log('Escuchando en el puerto: ' + PORT)
})


