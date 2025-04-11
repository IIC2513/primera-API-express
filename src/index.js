// src/index.js
const express = require('express');
const morgan = require('morgan');


const app = express();

// morgan middleware para mostrar logs de las peticiones HTTP en consola
app.use(morgan('dev'));

app.get('/', (req, res) => {
    res.send('Hola Mundo');
});

app.listen(3000, () => {
    console.log('Servidor escuchando en el puerto 3000');
});