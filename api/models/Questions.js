const Sequelize = require('sequelize');
const { db } = require('../../config/database');

const Questions = db.define('Questions', {
  questionnaire_id: {
    type: Sequelize.STRING,
    allowNull: false,
    primaryKey: true,
    references: 'questionnaire',
    referencesKey: 'questionnaire_id',
    field: 'questionnaire_id',
  },
  question_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    field: 'question_id',
  },
  question_description: {
    type: Sequelize.STRING,
    allowNull: false,
    field: 'question_description',
  },
  type: {
    type: Sequelize.STRING,
    allowNull: false,
    field: 'type',
  },
  isrequired: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    field: 'isrequired',
  },
}, { tableName: 'questions', timestamps: false });

module.exports = {
  Questions,
};