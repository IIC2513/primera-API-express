'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Asegúrate de que existan películas antes de insertar reseñas, para esto ejecutamos primero las seeds de películas
    await queryInterface.bulkInsert('Reviews', [{
      comment: '¡Excelente película!',
      rating: 9.0,
      movieId: 1, // Asegúrate de que el id 1 exista en el seeder de Movies
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      comment: 'Pudo haber estado mejor.',
      rating: 6.5,
      movieId: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      comment: 'Una obra maestra.',
      rating: 9.5,
      movieId: 2, // Supongamos que existe otra película con id 2 en el seeder de Movies
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Reviews', null, {});
  }
};
