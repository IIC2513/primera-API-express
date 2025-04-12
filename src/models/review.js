'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {

    static associate(models) {
      // Una review pertenece a una movie
      Review.belongsTo(models.Movie, { foreignKey: 'movieId', as: 'movie' });
    }
  }
  Review.init({
    comment: DataTypes.STRING,
    rating: DataTypes.FLOAT,
    movieId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Review',
  });
  return Review;
};