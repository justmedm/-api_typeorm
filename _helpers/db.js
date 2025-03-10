const config = require('config.json'); // Ensure the path is correct
const mysql = require('mysql2/promise');
const { Sequelize } = require('sequelize');

const db = {}; // Create an empty object for exporting models

module.exports = db;

initialize();

async function initialize() {
  // Destructure database config
  const { host, port, user, password, database } = config.database;

  // Create connection to MySQL server
  const connection = await mysql.createConnection({ host, port, user, password });

  // Create database if it doesn't exist
  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);

  // Connect to the database using Sequelize
  const sequelize = new Sequelize(database, user, password, { dialect: 'mysql' });

  // Initialize models and attach them to db object
  db.User = require('../users/user.model')(sequelize);

  // Sync all models with the database
  await sequelize.sync({ alter: true });

  console.log(" Database initialized and synced successfully!");
}