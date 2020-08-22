const fs = require('fs');
const Sequelize = require('sequelize');
const { stagingDB } = require('./connection');

const dbCa = fs.readFileSync('./db-certificate.crt');

const db = new Sequelize(
  stagingDB.database,
  stagingDB.username,
  stagingDB.password, {
    host: stagingDB.host,
    dialect: stagingDB.dialect,
    dialectOptions: {
      ssl: true,
      rejectUnauthorized: true,
      ca: [dbCa],
    },
    port: stagingDB.port,
    pool: {
      max: 5,
      min: 0,
      idle: 5000,
    },
    logging: false,
  },
);

module.exports = {
  db,
};
