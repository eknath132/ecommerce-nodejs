const { get, add, update, Delete } = require('../controlers/controler');

const { Router } = require('express');

const productos = Router();

productos.get('/:id?', get);
productos.post('/', add);
productos.put('/:id', update);
productos.delete('/:id', Delete);

module.exports = productos;