const Sequelize = require('sequelize');
const { db } = require('../../config/database');

const Answers = db.define('Answers', {
  answerer_name: {
    type: Sequelize.STRING,
    allowNull: false,
    field: 'answerer_name',
  },
  answerer_email: {
    type: Sequelize.STRING,
    allowNull: false,
    field: 'answerer_email',
    primaryKey: true,
  },
  answerer_company: {
    type: Sequelize.STRING,
    allowNull: false,
    field: 'answerer_company',
  },
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
    type: Sequelize.ARRAY(Sequelize.INTEGER),
    allowNull: true,
    field: 'option_id',
  },
  text_answer: {
    type: Sequelize.STRING,
    allowNull: true,
    field: 'text_answer',
  },
}, { tableName: 'answers', timestamps: false });

module.exports = {
  Answers,
};
