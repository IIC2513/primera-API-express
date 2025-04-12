// src/routes/index.js
const express = require('express');
// importamos el router de movies
const moviesRouter = require('./movies');

const router = express.Router();
// Definimos la ruta para las peliculas conectando el router de movies al principal
router.use('/movies', moviesRouter);
// ...
// más routers si hubiesen
// ...


// exportar para usarlo en la app principal
module.exports = router;