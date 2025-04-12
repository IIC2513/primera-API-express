// src/routes/movies.js
const express = require('express');
const router = express.Router();

// Importar el modelo Movie creado con sequelize
const { Movie } = require('../models');

// GET /movies
// Ahora tenemos que utilizar async para que espere la respuesta de la base de datos
router.get('/', async (req, res) => {
    // usamos try catch para manejar errores
    try {
        // buscamos todas las peliculas con await para esperar la respuesta
        const movies = await Movie.findAll();
        // enviamos el array de peliculas como respuesta, siempre en formato json y status 200
        res.status(200).json(movies);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error al obtener las películas' });
    }
});

module.exports = router;