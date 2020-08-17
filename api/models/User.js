const Sequelize = require('sequelize');
const { db } = require('../../config/database');

const User = db.define('User', {
  Email: {
    type: Sequelize.STRING,
    primaryKey: true,
    allowNull: false,
    field: 'email',
  },
  Password: {
    type: Sequelize.STRING,
    allowNull: false,
    field: 'password',
  },
  Institution: {
    type: Sequelize.STRING,
    allowNull: false,
    field: 'institution',
  },
  Name: {
    type: Sequelize.STRING,
    allowNull: false,
    field: 'name',
  },
  PhoneNumber: {
    type: Sequelize.STRING,
    allowNull: true,
    field: 'phone_number',
  },
  Job: {
    type: Sequelize.STRING,
    allowNull: false,
    field: 'job',
  },
  IsVerified: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    field: 'isverified',
  },
}, { tableName: 'users', timestamps: false });

module.exports = {
  User,
};
