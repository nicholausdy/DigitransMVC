const Sequelize = require('sequelize');
const { stagingDB } = require('./connection');

const db = new Sequelize(
  stagingDB.database,
  stagingDB.username,
  stagingDB.password, {
    host: stagingDB.host,
    dialect: stagingDB.dialect,
    dialectOptions: {
      ssl: true,
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
