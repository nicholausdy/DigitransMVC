const Sequelize = require('sequelize');
const { db } = require('../../config/database');

const OptionsToQuestionsMap = db.define('OptionsToQuestionsMap', {
  questionnaire_id: {
    type: Sequelize.STRING,
    allowNull: false,
    primaryKey: true,
    references: 'options',
    referencesKey: 'questionnaire_id',
    field: 'questionnaire_id',
  },
  question_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    references: 'options',
    referencesKey: 'question_id',
    field: 'question_id',
  },
  option_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    references: 'options',
    referencesKey: 'option_id',
    field: 'option_id',
  },
  questionnaire_id_dest: {
    type: Sequelize.STRING,
    allowNull: false,
    references: 'questions',
    referencesKey: 'questionnaire_id',
    field: 'questionnaire_id_dest',
  },
  question_id_dest: {
    type: Sequelize.STRING,
    allowNull: false,
    references: 'questions',
    referencesKey: 'question_id',
    field: 'question_id_dest',
  },
}, { tableName: 'options_to_questions_map', timestamps: false });

module.exports = {
  OptionsToQuestionsMap,
};
