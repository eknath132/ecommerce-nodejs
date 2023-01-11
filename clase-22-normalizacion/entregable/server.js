const express = require('express');
const productos = require('./routers/routers');
const productosTest = require('./routers/routersTest');
const { Server: HttpServer } = require('http')
const { Server: IOServer } = require('socket.io')
const container = require('./containers/container');
const { normalize, denormalize, schema } = require('normalizr')
const util = require ('util')

const chat = new container();
const app = express();
const port = process.env.port || 8080;
const httpServer = HttpServer(app)
const io = new IOServer(httpServer)

app.set('views', './views')
app.set('view engine', 'pug')

app.use(express.static(__dirname + "/Public"))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/productos', productos);
app.use('/test', productosTest);

io.on('connection', async socket =>{

  const listaMensajes = await chat.getChat()
  const strin = JSON.stringify(listaMensajes)
  const data = JSON.parse(strin)
  const mensajes = {
    id: 'backendCoder09',
    messages: data
  };
  // print(mensajes)
  console.log('Longitud del objeto original: ' + JSON.stringify(mensajes).length)

  const authorSchema = new schema.Entity("author",{},{idAttribute: "email"});
  const messageSchema = new schema.Entity("message", {
    author: authorSchema
  });
  const messagesSchema = new schema.Entity("messages", {
    messages: [messageSchema]
  });
  const messagesNorm = normalize(mensajes, messagesSchema);
  // print(messagesNorm)
  console.log('Longitud del objeto normalizado: ' + JSON.stringify(messagesNorm).length)

  const objDenormalizado = denormalize(messagesNorm.result, messagesSchema, messagesNorm.entities)
  // print(objDenormalizado)
  console.log('Longitud del objeto denormalizado: ' + JSON.stringify(objDenormalizado).length)

  console.log('Porcentaje de compresion: ' + (100 - (JSON.stringify(messagesNorm).length * 100 / JSON.stringify(mensajes).length)) + "%")

  socket.emit('messages', listaMensajes)

  socket.on('new-message', async data => {
    if (listaMensajes.length === 0) {
      return await chat.addChat({...data, fyh: new Date().toLocaleString(), id: 1})
    }
    await chat.addChat({...data, fyh: new Date().toLocaleString(), id: listaMensajes.length +1})

    io.sockets.emit('messages', listaMensajes)
  })
})

function print(objeto) {
  console.log(util.inspect(objeto,false,12,true))
}

httpServer.listen(port, () => {
  console.log(`RUN http://localhost:${port}`);
});