const socket = io()

socket.on('productosGet', async data => {
    const productosContenedor = document.getElementById('productosContenedor')
    const templateTabla = await fetch("./templates/table.handlebars");
    //Se convierte a formato del template
    const templateFormato = await templateTabla.text();
    const template = Handlebars.compile(templateFormato);

    //Generar HTML con template y datos
    const html = template({productos: data})
    productosContenedor.innerHTML = html;
})

const botonEnviar = document.getElementById('formSubmit')

botonEnviar.addEventListener('submit', (e) => {
    e.preventDefault()
    const producto = {
        producto: document.getElementById('producto').value,
        precio: document.getElementById('precio').value,
        thumbnail: document.getElementById('thumbnail').value
    }
    socket.emit('productoPost', producto)
})

const botonChat = document.getElementById('chatSubmit')

botonChat.addEventListener('submit', (e) => {
    e.preventDefault()
    const chat = {
        user: document.getElementById('username').value,
        text: document.getElementById('text').value,
        fecha: new Date().toLocaleString()
    }
    socket.emit('mensajePost', chat)
})



socket.on('mensajesGet', data => {
    const html = data.map( mensaje => {
        return `<div class="rounded col-6 text-break" style="background: gray">
        <strong style="color: blue">${mensaje.user}:</strong>
        <em style="color: green; font-style: italic ">${mensaje.text}</em>
        <br>
        <em style="color: brown">${mensaje.fecha}</em>
        </div>`

    })
    .join('<br>')

    document.getElementById('chatContenedor').innerHTML = html
})