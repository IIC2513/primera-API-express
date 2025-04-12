'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Movie extends Model {

    static associate(models) {
      // Una movie tiene muchas reviews
      Movie.hasMany(models.Review, { foreignKey: 'movieId', as: 'reviews' });
    }
  }
  Movie.init({
    title: DataTypes.STRING,
    genre: DataTypes.STRING,
    description: DataTypes.STRING,
    rating: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'Movie',
  });
  return Movie;
};