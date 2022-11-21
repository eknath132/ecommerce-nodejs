const fs = require('fs')
class Contenedor {
    constructor(name){
        this.name = name
    }

    async save (obj) {
        try {
            // Verificamos si existe un archivo
            if( fs.existsSync(`./${this.name}.txt`)) {
                const productos = await fs.promises.readFile(`./${this.name}.txt`, 'utf-8')
                const productosJson = JSON.parse(productos)
                // obtenemos el id mayor
                const idMayor  = Math.max(...productosJson.map(producto => producto?.id))
    
                const productoNuevo = {...obj, id: idMayor + 1 } // Agregamos el objeto al array
                productosJson.push(productoNuevo)
    
                return fs.promises.writeFile(`./${this.name}.txt`, JSON.stringify(productosJson, null , 2))
                .then(() => productoNuevo )
                .catch(() => {throw new Error ('Hubo un error al crearse el producto')})
            } else {
                const productoNuevo = {...obj, id: 1 }
                return fs.promises.writeFile(`./${this.name}.txt`, JSON.stringify([productoNuevo], null , 2))
                .then(() => productoNuevo)
                .catch(() =>  {throw new Error ('Hubo un error al crearse el producto')})
            }

        } catch (error) {
            // // Si no existe el archivo, creamos por primera vez la lista de productos
            throw new Error(error)
        }
    }

    async getById (id) {
        try {
            const productos = await fs.promises.readFile(`./${this.name}.txt`, 'utf-8')
            const productosJson = JSON.parse(productos)
            const productoEncontrado = productosJson.find(producto => producto.id === parseInt(id))
            if(!productoEncontrado) {
                throw ('Producto no encontrado')
            }
            return productoEncontrado
        } catch (error) {
            throw error
        }
    }

    async update (body, productoParaActualizar ,productosJson) {
        try {
            const productoActualizado = {...productoParaActualizar, ...body}

            const nuevoArrayProductos = productosJson.map(producto => {
                if(producto.id === productoActualizado.id){
                    return (producto = {...producto, ...productoActualizado})
                }
                return producto
            })

            return fs.promises.writeFile(`./${this.name}.txt`, JSON.stringify(nuevoArrayProductos, null , 2))
            .then(() => productoActualizado )
            .catch(() => {throw new Error ('Hubo un error al crearse el producto')})

        } catch (error) {
            throw error
        }
    }

    async getAll () {
        if( fs.existsSync(`./productos.txt`)) {
            const archivos = await fs.promises.readFile(`./${this.name}.txt`, 'utf-8')
            const archivoParse = JSON.parse(archivos)
            return archivoParse
        }else {
            return []
        }
    }

    async deleteById (archivosParseados, id) {
        try {
            // Se guarda el nuevo arreglos sin el id que queremos eliminar
            let nuevoArray = archivosParseados.filter(archivo => archivo.id !==  parseInt(id))
            const statusSave = fs.promises.writeFile(`./${this.name}.txt`, JSON.stringify(nuevoArray, null, 2))
            .then(() => 'Producto eliminado con exito')
            .catch(( err ) =>  err )
            return statusSave
        } catch (error) {
            throw new Error(error)
        }
    }

    async deleteAll () {
        try {
            await fs.promises.readFile(`./${this.name}.txt`, 'utf-8')
            // Se sobrescribe con un array vacio
            fs.promises.writeFile(`./${this.name}.txt`, JSON.stringify([], null, 2))
            .then(() => console.log('Todos los archivos fueron eliminados'))
            .catch(() => console.log('Hubo un error al eliminar el contenido'))

        } catch (error) {
            console.log( error)
        }
    }
}

module.exports = Contenedor

// const productos = new Contenedor('productos')
// productos.save({title:'titulo1', price:1, thumbnail: 'titulo1'})
// productos.save({title:'titulo2', price:2, thumbnail: 'titulo2'})
// productos.save({title:'titulo3', price:3, thumbnail: 'titulo3'})
// productos.getAll().then( data => console.log('Success', data)).catch( data => console.log('Error', data))
// productos.deleteById(4).then( data => console.log('Success', data) ).catch( data => console.log('Error', data))
// productos.deleteAll()