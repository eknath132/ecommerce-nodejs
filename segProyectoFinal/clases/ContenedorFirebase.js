// instalar npm i firebase-admin
// instalar npm i @google-cloud/firestore
import admin from "firebase-admin";
import fs from 'fs'

const serviceAccount =  JSON.parse(fs.readFileSync('./config/ecommerce-aa1aa-firebase-adminsdk-6a67o-e6c3017402.json'));

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore()
const query = db.collection('carrito')

class Contenedor {
    constructor(){

    }

    async getCarritoId(id) {
        try {
            // doc() es para buscar un doc en especifico
            const carrito = await query.doc(id).get()
            return carrito.data()
        } catch (error) {
            console.log(error)
        }
    }

    async addCarrito(){ 
        try {
            const newCarrito = await query.add({timestamp: Date.now(), productos: [], nombre: ''})
            return newCarrito
        } catch (error) {
            
        }
    }

    async postProductoinCarrito(id, objProducto) {
        try {
            let {productos} = await this.getCarritoId(id)
            productos.push(objProducto)
            await query.doc(id).set(JSON.parse(JSON.stringify({productos})))
            return true
        } catch (error) {
            console.log(error)
        }
    }

    async deleteCarrito(id) {
        try {
            await query.doc(id).delete()
            return true
        } catch (error) {
            console.log(error)
        }

    }

    async deleteProductoinCarrito(id, productoId) {
        try {
            const {productos} = await this.getCarritoId(id)
            console.log('productos', productos)
            const newProductosArray = productos.filter(producto => producto._id != productoId)
            await query.doc(id).set(JSON.parse(JSON.stringify({productos: newProductosArray})))
            return true
        } catch (error) {
            console.log(error)
        }
    }

}

export default Contenedor



