const Sequelize = require('sequelize');
const { db } = require('../../config/database');

const Scores = db.define('Scores', {
  answerer_email: {
    type: Sequelize.STRING,
    allowNull: false,
    primaryKey: true,
    field: 'answerer_email',
  },
  questionnaire_id: {
    type: Sequelize.STRING,
    allowNull: false,
    primaryKey: true,
    field: 'questionnaire_id',
  },
  total_score: {
    type: Sequelize.INTEGER,
    allowNull: false,
    field: 'total_score',
  },
}, { tableName: 'scores', timestamps: false });

module.exports = {
  Scores,
};
