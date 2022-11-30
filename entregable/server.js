const express = require('express')
const contenedor = require('./classProducto')

const handlebars = require('express-handlebars')

const { Server: HttpServer } = require('http')
const { Server: IOServer } = require('socket.io')

const app = express()
const httpServer = new HttpServer(app)
const io = new IOServer(httpServer)

const productos = new contenedor('productos')
const chats = new contenedor('chat')


// HANDLEBARS
app.engine('handlebars', handlebars.engine())
app.set('views', './handlebars')
app.set('view engine', 'handlebars')
app.use(express.static(__dirname+"/public"))

io.on('connection', async socket => {
    console.log(' >>> Nuevo cliente <<< ')
    
    // Se envian los producto existentes
    const products = await productos.getAll()
    io.sockets.emit('productosGet', products)
    
    // Se guardan los productos
    socket.on('productoPost', async data => {
        const productoGuardado = await productos.save(data)
        if(productoGuardado) {
            const products = await productos.getAll()
            io.sockets.emit('productosGet', products )
        } 
    })

    // Se envian los chats existentes
    const chat = await chats.getAll()
    io.sockets.emit('mensajesGet', chat)

    // Se guardan los productos
    socket.on('mensajePost', async data => {
        const chatGenerado = await chats.save(data)
        if(chatGenerado) {
            const chat = await chats.getAll()
            io.sockets.emit('mensajesGet', chat )
        } 
    })
})

app.get('/', (req,res) => {
    res.render('datos')
})

const PORT = 8000
const servidor = httpServer.listen(PORT, () => {
    console.log('Escuchando en el puerto: ' + PORT)
})
