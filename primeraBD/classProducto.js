const fs = require('fs')
const knex = require('knex')

class Contenedor {
    constructor(name, options){
        this.knex = knex(options)
        this.name = name
    }

    crearTabla() {
        return this.knex.schema.dropTableIfExists(this.name)
            .finally(() => {
                return this.knex.schema.createTable(this.name, table => {
                    table.increments('id').primary()
                    table.string('producto', 50).notNullable()
                    table.string('thumbnail', 250).notNullable()
                    table.float('precio')
                })
            })
    }

    async save (obj) {
        return this.knex(this.name).insert(obj)
    }

    // async getById (id) {
    //     try {
    //         const productos = await fs.promises.readFile(`./${this.name}.txt`, 'utf-8')
    //         const productosJson = JSON.parse(productos)
    //         const productoEncontrado = productosJson.find(producto => producto.id === parseInt(id))
    //         if(!productoEncontrado) {
    //             throw ('Producto no encontrado')
    //         }
    //         return productoEncontrado
    //     } catch (error) {
    //         throw error
    //     }
    // }

    // async update (body, productoParaActualizar ,productosJson) {
    //     try {
    //         const productoActualizado = {...productoParaActualizar, ...body}

    //         const nuevoArrayProductos = productosJson.map(producto => {
    //             if(producto.id === productoActualizado.id){
    //                 return (producto = {...producto, ...productoActualizado})
    //             }
    //             return producto
    //         })

    //         return fs.promises.writeFile(`./${this.name}.txt`, JSON.stringify(nuevoArrayProductos, null , 2))
    //         .then(() => productoActualizado )
    //         .catch(() => {throw new Error ('Hubo un error al crearse el producto')})

    //     } catch (error) {
    //         throw error
    //     }
    // }

    async getAll () {
        return this.knex(this.name).select('*')
    }

    // async deleteById (archivosParseados, id) {
    //     try {
    //         // Se guarda el nuevo arreglos sin el id que queremos eliminar
    //         let nuevoArray = archivosParseados.filter(archivo => archivo.id !==  parseInt(id))
    //         const statusSave = fs.promises.writeFile(`./${this.name}.txt`, JSON.stringify(nuevoArray, null, 2))
    //         .then(() => 'Producto eliminado con exito')
    //         .catch(( err ) =>  err )
    //         return statusSave
    //     } catch (error) {
    //         throw new Error(error)
    //     }
    // }

    // async deleteAll () {
    //     try {
    //         await fs.promises.readFile(`./${this.name}.txt`, 'utf-8')
    //         // Se sobrescribe con un array vacio
    //         fs.promises.writeFile(`./${this.name}.txt`, JSON.stringify([], null, 2))
    //         .then(() => console.log('Todos los archivos fueron eliminados'))
    //         .catch(() => console.log('Hubo un error al eliminar el contenido'))

    //     } catch (error) {
    //         console.log( error)
    //     }
    // }
}

module.exports = Contenedor