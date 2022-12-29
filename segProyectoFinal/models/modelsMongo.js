import mongoose from "mongoose";

const productoCollName = 'producto'

const productoSchema = new mongoose.Schema({
    nombre: { type: String, required: true},
    descripcion: { type: String, required: true},
    codigo: { type: String, required: true},
    foto: { type: String, required: true},
    precio: { type: Number, required: true},
    stock: {type: Number, required: true},
    timestap: {type: Date, default: Date.now},
    saludo: {type: String}
})

export const modelProducto = mongoose.model(productoCollName, productoSchema)