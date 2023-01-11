const mongoose = require('mongoose');

const collectionChat = "chat"

const schemaChat = new mongoose.Schema({
    author:
        {
            email: String,
            nombre: String,
            apellido: String,
            edad: Number,
            alias: String,
            avatar: String
        },
    text: String,
    fyh: String,
    id: Number
})

const models = mongoose.model(collectionChat, schemaChat)

module.exports = models