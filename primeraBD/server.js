const express = require('express')
const contenedor = require('./classProducto')
const contenedorChat = require('./classChat')
const {options} = require('./options/mysqlconnection')
const { sqlliteOptions } = require('./options/sqlite3')
const handlebars = require('express-handlebars')

const { Server: HttpServer } = require('http')
const { Server: IOServer } = require('socket.io')

const app = express()
const httpServer = new HttpServer(app)
const io = new IOServer(httpServer)

const productos = new contenedor('productos', options)
const chats = new contenedorChat('chat', sqlliteOptions)


// HANDLEBARS
app.engine('handlebars', handlebars.engine())
app.set('views', './handlebars')
app.set('view engine', 'handlebars')
app.use(express.static(__dirname+"/public"))

productos.crearTabla().then(() => {
    chats.crearTabla().then(() => console.log('Tablas creadas'))
})

io.on('connection', async socket => {
    console.log(' >>> Nuevo cliente <<< ')
    
    // Se envian los producto existentes
    productos.getAll().then((data) => {
        io.sockets.emit('productosGet', data)
    })
    // io.sockets.emit('productosGet', products)
    
    // Se guardan los productos
    socket.on('productoPost', data => {
        productos.save(data).then(() => {
            productos.getAll().then((select) => {
                io.sockets.emit('productosGet', select)
            })
        })
    })

    // Se envian los chats existentes
    chats.getAll().then((data) => {
        io.sockets.emit('mensajesGet', data)
    })

    // Se guardan los productos
    socket.on('mensajePost', data => {
        chats.save(data).then(() => {
            chats.getAll().then((select) => {
                console.log('select', select)
                io.sockets.emit('mensajesGet', select)
            })
        })
    })

  
})

app.get('/', (req,res) => {
    res.render('datos')
})

const PORT = 8000
const servidor = httpServer.listen(PORT, () => {
    console.log('Escuchando en el puerto: ' + PORT)
})
