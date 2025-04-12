// src/routes/movies.js
const express = require('express');
const router = express.Router();

// GET /movies
router.get('/', (req, res) => {
    res.send('GET /movies');
});

// exportar router 
module.exports = router;