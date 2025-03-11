import { Sequelize, Model } from 'sequelize';
import mysql from 'mysql2/promise';

interface DatabaseConfig {
    host: string;
    port: number;
    user: string;
    password: string;
    database: string;
}

interface Config {
    database: DatabaseConfig;
}

interface DB {
    User?: any; // Type will be properly defined when user.model is converted to TS
    [key: string]: any;
}

const config: Config = require('config.json');

const db: DB = {};

export default db;

async function initialize(): Promise<void> {
    // create db if it doesn't already exist
    const { host, port, user, password, database } = config.database;
    const connection = await mysql.createConnection({ host, port, user, password });
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);

    // connect to db
    const sequelize = new Sequelize(database, user, password, { dialect: 'mysql' });

    // init models and add them to the exported db object
    db.User = require('../users/user.model')(sequelize);

    // sync all models with database
    await sequelize.sync({ alter: true });
}

initialize();