const Sequelize = require('sequelize');
const { db } = require('../../config/database');

const Options = db.define('Options', {
  questionnaire_id: {
    type: Sequelize.STRING,
    allowNull: false,
    primaryKey: true,
    references: 'questions',
    referencesKey: 'questionnaire_id',
    field: 'questionnaire_id',
  },
  question_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    references: 'questions',
    referencesKey: 'question_id',
    field: 'question_id',
  },
  option_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    field: 'option_id',
  },
  description: {
    type: Sequelize.STRING,
    allowNull: false,
    field: 'description',
  },
  score: {
    type: Sequelize.INTEGER,
    allowNull: false,
    field: 'score',
  },
  number_chosen: {
    type: Sequelize.INTEGER,
    allowNull: false,
    field: 'number_chosen',
  },
}, { tableName: 'options', timestamps: false });

module.exports = {
  Options,
};