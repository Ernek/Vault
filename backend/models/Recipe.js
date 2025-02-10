const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Recipe = sequelize.define("Recipe", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  image: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  ingredients: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  preparationtime: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
});

module.exports = Recipe;
