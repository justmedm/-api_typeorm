const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
  const attributes = {
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    passwordHash: { type: DataTypes.STRING, allowNull: false },
    title: { type: DataTypes.STRING, allowNull: false },
    firstName: { type: DataTypes.STRING, allowNull: false },
    lastName: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.STRING, allowNull: false }
  };

  const options = {
    defaultScope: {
      // Exclude passwordHash by default
      attributes: { exclude: ['passwordHash'] }
    },
    scopes: {
      // Include passwordHash when using this scope
      withHash: { attributes: {} }
    }
  };

  return sequelize.define('User', attributes, options);
}

module.exports = model;