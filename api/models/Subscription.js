const Sequelize = require('sequelize');
const { db } = require('../../config/database');

const Subscription = db.define('Subscription', {
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    primaryKey: true,
    references: 'users',
    referencesKey: 'email',
    field: 'email',
  },
  start_date: {
    type: Sequelize.DATE,
    allowNull: true,
    defaultValue: Sequelize.NOW,
    field: 'start_date',
  },
  amounts_paid: {
    type: Sequelize.FLOAT,
    allowNull: true,
    defaultValue: 0,
    field: 'amounts_paid',
  },
}, { tableName: 'subscription', timestamps: false });

module.exports = {
  Subscription,
};
