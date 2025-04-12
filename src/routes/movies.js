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

// Endpoint para obtener una película y sus reseñas
router.get('/:id', async (req, res) => {
    try {
      const movie = await Movie.findByPk(req.params.id, {
        // incluimos las reviews de la pelicula
        include: [
          {
            model: Review,
            as: 'reviews'
          }
        ]
      });
      if (!movie) return res.status(404).json({ error: 'Película no encontrada' });
      res.status(200).json(movie);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  });

module.exports = router;