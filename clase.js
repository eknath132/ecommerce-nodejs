class Usuario {
    constructor(nombre, apellido, libros, mascotas){
        this.nombre = nombre,
        this.apellido = apellido,
        this.libros = libros,
        this.mascotas = mascotas
    }

    getFullName(){
        return console.log(`El nombre completo del usuario es ${this.nombre} ${this.apellido}`)
    } 

    addMascota(mascota){
        this.mascotas.push(mascota)
        return console.log(`Se agrego una nueva mascota`)
    }
    countMascotas(){
        return console.log(`El usuario ${this.nombre} tiene ${this.mascotas.length} mascotas `)
    }
    addBook(name, autor){
        this.libros.push({nombre: name, autor})
        return console.log('Se agrego un nuevo libro')
    }
    getBookNames(){
        let newLibros = this.libros.map(libro => libro.nombre)
        return console.log(newLibros)
    }
}

const primerUsuario = new Usuario('renzo', 'perales', [{nombre: 'el mejor libro', autor:'el mejor autor'}], ['perro', 'gato'])

primerUsuario.getFullName()
primerUsuario.addMascota('hamster')
primerUsuario.countMascotas()
primerUsuario.addBook('el 2do mejor libro', 'el 2do mejor autor')
primerUsuario.getBookNames()


