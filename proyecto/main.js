const express = require('express')
const contenedor = require('./classProducto')

const app = express()
const PORT = 8001

const productos = new contenedor('productos')

app.get('/productos', async(req, res) => {
    try {
        const allProducts = await productos.getAll()
        res.send(allProducts)

    } catch (error) {
        throw new Error('Hubo un nuevo error')
    }
})

app.get('/productosRandom', async(req,res) => {
    try {
        const allProducts = await productos.getAll()
        const numeroRandom = Math.floor(Math.random() * (allProducts.length)) + 1
        const productoAleatorio =  await productos.getById(numeroRandom)
        res.send(productoAleatorio)
    } catch (error) {
        throw new Error('No existe un producto con ese id', + error)
    }
})

app.listen(PORT, () => {
    console.log('Escuchando en el puerto: ' + PORT)
})


