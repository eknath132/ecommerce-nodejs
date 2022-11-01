const fs = require('fs')

class Contenedor {
    constructor(name){
        this.name = name
    }

    async save (obj) {
        try {
            // Verificamos si existe un archivo
            const archivos = await fs.promises.readFile(`./${this.name}.txt`, 'utf-8')
            // parseamos el archivo
            const archivoParse = JSON.parse(archivos) 
            // agregamos la funcion de marh max para obtener el id mas alto
            const ultimoId = archivoParse.reverse()
            // pusheamos el nuevo objeto al array de archivoParse y con el id sumado + 1
            archivoParse.push({...obj, id: ultimoId[0].id + 1 })
            // Agregamos nuevamente la lista de productos con los nuevos productos
            return fs.promises.writeFile(`./${this.name}.txt`, JSON.stringify(archivoParse, null , 2))
            .then(() => 'Se creo exitosamente el nuevo producto con el id: ' + (ultimoId[0].id + 1))
            .catch(() => {throw new Error ('Hubo un error al crearse el producto')})

        } catch (error) {
            // Si no existe el archivo, creamos por primera vez la lista de productos
            return fs.promises.writeFile(`./${this.name}.txt`, JSON.stringify([{...obj, id:1}], null , 2))
            .then(() => 'Se creo exitosamente el primer producto con el id: ' + 1)
            .catch(() =>  {throw new Error ('Hubo un error al crearse el producto')})
        }
        
    }

    async getById (id) {
        try {
            const archivos = await fs.promises.readFile(`./${this.name}.txt`, 'utf-8')
            // parseamos el archivo
            const archivoParse = JSON.parse(archivos)
            // Buscamos el producto con el id
            const productoEncontrado = archivoParse.find(archivo => archivo.id === id)
            // Si el producto no existe tira genera un new Error
            if(!productoEncontrado) {
                throw (null)
            }
            return productoEncontrado
        } catch (error) {
            throw new Error( error )
        }
    }

    async getAll () {
        try {
            const archivos = await fs.promises.readFile(`./${this.name}.txt`, 'utf-8')
            // parseamos el archivo
            const archivoParse = JSON.parse(archivos)
            return archivoParse
        } catch (error) {
            throw new Error( error )
        }
    }

    async deleteById (id) {
        try {
            const archivos = await fs.promises.readFile(`./${this.name}.txt`, 'utf-8')
            // parseamos el archivo
            const archivoParse = JSON.parse(archivos)
            // Buscamos el id para ver si el producto existe
            const productoEncontrado = archivoParse.find(archivo => archivo.id === id)
            if(!productoEncontrado) {
                throw ('No fue encontrado el producto con id :' + id)
            }
            // Se guarda el nuevo arreglos sin el id que queremos eliminar
            let nuevoArray = archivoParse.filter(archivo => archivo.id !== id)
            if(!nuevoArray) {
                nuevoArray = []
            }
            fs.promises.writeFile(`./${this.name}.txt`, JSON.stringify(nuevoArray, null, 2))
            .then(() => console.log('El archivo fue eliminado exitosamente'))
            .catch(() => console.log('Hubo un error al eliminarse el producto'))

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

const productos = new Contenedor('productos')
productos.save({title:'titulo1', price:1, thumbnail: 'titulo1'})
productos.save({title:'titulo2', price:2, thumbnail: 'titulo2'})
productos.save({title:'titulo3', price:3, thumbnail: 'titulo3'}).then(data => console.log('Success', data)).catch( error => console.log('Error', error))
productos.getById(3).then( data => console.log('Success',data) ).catch( data => console.log('Error', data))
productos.getAll().then( data => console.log('Success', data)).catch( data => console.log('Error', data))
productos.deleteById(4).then( data => console.log('Success', data) ).catch( data => console.log('Error', data))
productos.deleteAll()