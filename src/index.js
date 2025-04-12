// src/index.js
const express = require('express');
const morgan = require('morgan');

// importamos el router principal 
const router = require('./routes');

const app = express();

// morgan middleware para mostrar logs de las peticiones HTTP en consola
app.use(morgan('dev'));

// servidor utiliza el router principal
app.use(router);

app.get('/', (req, res) => {
    res.send('Hola Mundo');
});

app.listen(3000, () => {
    console.log('Servidor escuchando en el puerto 3000');
});