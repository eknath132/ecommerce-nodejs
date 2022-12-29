import * as model from '../models/modelsMongo.js' // se llama al modelo de mongo
import mongoose from 'mongoose'

const URL = 'mongodb+srv://renzo:123@backend.cieevrz.mongodb.net/ecommerce?retryWrites=true&w=majority'

await mongoose.connect(URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('conectadoooo')
})

class Contenedor {
    constructor(){
        this._id = '_id'
    }
    // Buscar producto por id 
    async findProducto(id){
        try {
            // Verificamos que el id realmente sea el correcto para que pueda verificar
            if (!id.match(/^[0-9a-fA-F]{24}$/)) {
                return 'Id invalido'
            }
            const existeProducto = await model.modelProducto.findById(id)
            return existeProducto
        } catch (error) {
            console.log(error)
        }
    }
    // Buscar todos los productos
    async getAllProductos(){
        try {
            // await this.connect()
            const productos = model.modelProducto.find()
            return productos
        } catch (error) {
            console.log(error)
        }
    }

    async createProducto(productoObj) {
        try {
            // 'new' para agregar un producto nuevo
            const newProducto = new model.modelProducto(productoObj)
            // save() para impactar en la base de datos
            await newProducto.save()
            return newProducto
        } catch (error) {
            console.log(error)
        }
    }

    async updateProducto(id, obj){
        try {
            await model.modelProducto.findByIdAndUpdate(id, obj, {return: true})
            return true
        } catch (error) {
            console.log(error)
        }
    }

    async deleteProducto(id){
        try {
            await model.modelProducto.findByIdAndRemove(id)
            return true
        } catch (error) {
            console.log(error)
        }
    }

}

export default Contenedor