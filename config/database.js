const Sequelize = require('sequelize');
const { stagingDB } = require('./connection');

const db = new Sequelize(
  stagingDB.database,
  stagingDB.username,
  stagingDB.password, {
    host: stagingDB.host,
    dialect: stagingDB.dialect,
    port: stagingDB.port,
    pool: {
      max: 5,
      min: 0,
      idle: 5000,
    },
    logging: false,
    native: true,
  },
);

module.exports = {
  db,
};
