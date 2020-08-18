const { Op } = require('sequelize');
const { Options } = require('../models/Options');
const { Questions } = require('../models/Questions');
const { Scores } = require('../models/Scores');

class ScoreHandler {
  constructor(msg) {
    this.msg = msg;
  }

  static async getQuestionInfo(questionnaireId, questionId) {
    try {
      const questionInfo = await Questions.findOne({
        attributes: ['type'],
        where: {
          [Op.and]: [
            { questionnaire_id: questionnaireId },
            { question_id: questionId },
          ],
        },
      });
      return questionInfo.type;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  static async getOptionScore(questionnaireId, questionId, optionId ) {
    try {
      const optionScore = await Options.findOne({
        attributes: ['score'],
        where: {
          [Op.and]: [
            { questionnaire_id: questionnaireId },
            { question_id: questionId },
            { option_id: optionId },
          ],
        },
      });
      return optionScore.score;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  static async calculateScoreOfSingleObject(questionnaireId, answerObject) {
    try {
      let scoreResult = 0;
      for ( let j = 0; j < answerObject.answer.length; j++) {
        if (typeof answerObject.answer[0] !== 'undefined') {
          const optionScore = await ScoreHandler.getOptionScore(questionnaireId,
            answerObject.question_id, answerObject.answer[j]);
          scoreResult += optionScore;
        }
      }
      return scoreResult;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async calculate() {
    try {
      let scoreResult = 0;
      for ( let i = 0; i < this.msg.answers.length; i++) {
        const questionType = await ScoreHandler.getQuestionInfo(this.msg.questionnaire_id,
          this.msg.answers[i].question_id)
        if ((questionType === 'checkbox') || (questionType === 'radio')) {
          scoreResult += await ScoreHandler.calculateScoreOfSingleObject(this.msg.questionnaire_id,
            this.msg.answers[i]);
        }
      }
      const recordToInsert = {
        answerer_email: this.msg.answerer_email,
        questionnaire_id: this.msg.questionnaire_id,
        total_score: scoreResult,
      };

      await Scores.create(recordToInsert);
    } catch (error) {
      console.log(error)
      throw new Error(error.message);
    }
  }
}

module.exports = ScoreHandler;