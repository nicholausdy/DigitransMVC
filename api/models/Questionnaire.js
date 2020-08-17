const Sequelize = require('sequelize');
const { db } = require('../../config/database');

const Questionnaire = db.define('Questionnaire', {
  Email: {
    type: Sequelize.STRING,
    allowNull: false,
    references: 'users',
    referencesKey: 'email',
    field: 'email',
  },
  QuestionnaireTitle: {
    type: Sequelize.STRING,
    allowNull: false,
    field: 'questionnaire_title',
  },
  QuestionnaireDescription: {
    type: Sequelize.STRING,
    allowNull: false,
    field: 'questionnaire_desc',
  },
  QuestionnaireId: {
    type: Sequelize.STRING,
    allowNull: false,
    primaryKey: true,
    field: 'questionnaire_id',
  },
}, { tableName: 'questionnaire', timestamps: false });

module.exports = {
  Questionnaire,
};
