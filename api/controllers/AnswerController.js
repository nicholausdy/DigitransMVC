const { Op } = require('sequelize');
const { QueryTypes } = require('sequelize');
const NATSPublisher = require('../services/publish.service');
const AuthService = require('../services/auth.service');
const { Answers } = require('../models/Answers');
const { Questions } = require('../models/Questions');
const { db } = require('../../config/database');

const publisher = new NATSPublisher();

(async () => {
  await publisher.connect();
})();

class AnswerController {
  constructor(req, res) {
    this.req = req;
    this.res = res;
  }

  async validateAnswerInput() {
    try {
      const { body } = this.req;
      if (Boolean(body.questionnaire_id)
          && Boolean(body.answerer_name)
          && Boolean(body.answerer_email)
          && Boolean(body.answerer_company)
          && Boolean(body.answers)) {
        return true;
      }
      return false;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  
  /* const questionInfo = await Questions.findOne({
      attributes: ['type'],
      where: {
        [Op.and]: [
          { questionnaire_id: this.req.body.questionnaire_id},
          { question_id: answerObject.question_id }
        ],
      },
    }); */
  static async updateOptionNumberChosen(questionnaireId, questionId, optionId) {
    try {
      const queryString = ` update options set number_chosen = number_chosen + 1
      where questionnaire_id = :questionnaire_id
      AND question_id = :question_id AND option_id = :option_id;`

      await db.query(queryString, {
        replacements: { 
          questionnaire_id: questionnaireId,
          question_id: questionId,
          option_id: optionId,
        },
        type: QueryTypes.UPDATE,
      });
    } catch (error) {
      throw new Error(error.message);
    }
  }

  static async updateNumberChosenFromAnswerObject(questionnaireId, answerObject) {
    try {
      const asyncOp = [];
      const questionInfo = await Questions.findOne({
        attributes: ['type'],
        where: {
          [Op.and]: [
            { questionnaire_id: questionnaireId },
            { question_id: answerObject.question_id },
          ],
        },
      });
      if ((questionInfo.type === 'radio') || (questionInfo.type === 'checkbox')) {
        const listOfOptionIds = answerObject.answer;
        if (typeof listOfOptionIds[0] !== 'undefined') {
          for (let i = 0; i < listOfOptionIds.length; i++ ) {
            const updateOp = AnswerController.updateOptionNumberChosen(questionnaireId, 
              answerObject.question_id, listOfOptionIds[i]);
            asyncOp.push(updateOp);
          }
        }
        await Promise.all(asyncOp);
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }

  static async createListOfObjectToBeInserted(body) {
    const result = [];
    try {
      for ( let i = 0; i < body.answers.length; i++) {
        const object = {};
        object.answerer_name = body.answerer_name;
        object.answerer_email = body.answerer_email;
        object.answerer_company = body.answerer_company;
        object.questionnaire_id = body.questionnaire_id;
        object.question_id = body.answers[i].question_id;
        const questionInfo = await Questions.findOne({
          attributes: ['type'],
          where: {
            [Op.and]: [
              { questionnaire_id: body.questionnaire_id },
              { question_id: body.answers[i].question_id },
            ],
          },
        });
        if ((questionInfo.type === 'radio') || (questionInfo.type === 'checkbox')) {
          object.option_id = body.answers[i].answer;
        } else {
          object.text_answer = body.answers[i].answer[0]; 
        }
        result.push(object);
      }
      return result;
    } catch (error) {
      throw new Error(error.message);
    }
  } 

  async answer() {
    try {
      const isInputValid = await this.validateAnswerInput();
      if (!(isInputValid)) {
        return this.res.status(400).json({ success: false, message: 'Missing fields detected' });
      }
      const { body } = this.req;
      const listOfObjectToInsert = await AnswerController.createListOfObjectToBeInserted(body);
      await Answers.bulkCreate(listOfObjectToInsert);
      const answerPart = body.answers;
      const asyncOp = [];
      for ( let i = 0 ; i < answerPart.length; i++) {
        const updateNumberChosenOp = AnswerController.updateNumberChosenFromAnswerObject(
          body.questionnaire_id,
          answerPart[i]
        );
        asyncOp.push(updateNumberChosenOp);
      }
      await Promise.all(asyncOp);
      await publisher.publish('scoreCall', body);
      return this.res.status(200).json({ success: true, message: 'Answer saved' });
    } catch (error) {
      console.log(error)
      return this.res.status(500).json({
        success: false,
        message: error.name,
        detail: error.message,
      });
    }
  }
}

module.exports = AnswerController;
