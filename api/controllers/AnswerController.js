const { Op } = require('sequelize');
const { QueryTypes } = require('sequelize');
const { publisher } = require('../services/publish.service');
const AuthService = require('../services/auth.service');
const { Answers } = require('../models/Answers');
const { Questions } = require('../models/Questions');
const { Options } = require('../models/Options');
const { db } = require('../../config/database');
const { Scores } = require('../models/Scores');

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

  static async validateAnswerList(questionType, listOfAnswer, isRequired) {
    if ((listOfAnswer.length === 0) && (isRequired)) {
      throw new Error('Some required questions have not been answered');
    }
    if ((listOfAnswer.length > 1) && (questionType === 'radio')) {
      throw new Error('Radio question type should only have 1 answer');
    }
  }

  static async validateAnswerBody(body) {
    try {
      const questionList = await Questions.findAll({
        attributes: ['question_id'],
        where: {
          questionnaire_id: body.questionnaire_id,
        },
        order: [
          ['question_id', 'ASC'],
        ],
      });
      const answerPart = body.answers;
      for (let i = 0; i < questionList.length; i++) {
        const found = answerPart.find(element => element.question_id === questionList[i].question_id);
        if (typeof found === 'undefined') {
          throw new Error('Missing answer part detected');
        }
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
          attributes: ['type','isrequired'],
          where: {
            [Op.and]: [
              { questionnaire_id: body.questionnaire_id },
              { question_id: body.answers[i].question_id },
            ],
          },
        });
        await AnswerController.validateAnswerList(questionInfo.type, body.answers[i].answer, questionInfo.isrequired);
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
      // await AnswerController.validateAnswerBody(body);
      const listOfObjectToInsert = await AnswerController.createListOfObjectToBeInserted(body);
      await Answers.bulkCreate(listOfObjectToInsert);
      const answerPart = body.answers;
      const asyncOp = [];
      for ( let i = 0; i < answerPart.length; i++) {
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
  
  static async getQuestionInfo(questionnaireId, questionId) {
    try {
      const questionInfo = await Questions.findOne({
        attributes: ['type', 'question_description'],
        where: {
          [Op.and]: [
            { questionnaire_id: questionnaireId },
            { question_id: questionId },
          ],
        },
      });
      return questionInfo;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  static async getAnswersFromDB(questionnaireId, answererEmail) {
    try {
      const queryResult = await Answers.findAll({
        where: {
          [Op.and]: [
            { questionnaire_id: questionnaireId },
            { answerer_email: answererEmail },
          ],
        },
      });
      return queryResult;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  static async pairAnswersAndOptionsInfo(questionnaireId, questionId, answerListForSingleQuestion) {
    try {
      const orStatement = [];
      // create dynamic or query based on answers, which is list of option_id
      for (let i = 0; i < answerListForSingleQuestion.length; i++) {
        const optionIdStatement = {};
        optionIdStatement.option_id = answerListForSingleQuestion[i];
        orStatement.push(optionIdStatement);
      }
      const queryResult = await Options.findAll({
        attributes: ['option_id', 'description', 'score'],
        where: {
          [Op.and]: [
            { [Op.or]: orStatement },
            { questionnaire_id: questionnaireId },
            { question_id: questionId },
          ],
        },
      });
      return queryResult;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  static async calculateScorePerQuestionOnSingleAnswer(listOfOptionInfo) {
    // static method to calculate total score per question on a single answer
    try {
      let score = 0;
      for (let i = 0; i < listOfOptionInfo.length; i++) {
        score += listOfOptionInfo[i].score;
      }
      return score;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  static async answerPartFormatter(answersQueryResult) {
    try {
      const listofAnswer = [];
      for ( let i = 0; i < answersQueryResult.length; i++) {
        const answerObject = {};
        answerObject.question_id = answersQueryResult[i].question_id;
        const questionInfo = await AnswerController.getQuestionInfo(
          answersQueryResult[i].questionnaire_id,
          answersQueryResult[i].question_id);
        answerObject.type = questionInfo.type;
        answerObject.question_description = questionInfo.question_description
        if (questionInfo.type === 'checkbox' || questionInfo.type === 'radio') {
          answerObject.answer = await AnswerController.pairAnswersAndOptionsInfo(answersQueryResult[i].questionnaire_id, 
            answersQueryResult[i].question_id, answersQueryResult[i].option_id);
          answerObject.score = await AnswerController.calculateScorePerQuestionOnSingleAnswer(answerObject.answer);
        } else {
          const singleElementList = [];
          singleElementList.push(answersQueryResult[i].text_answer);
          answerObject.answer = singleElementList;
        }
        listofAnswer.push(answerObject);
      }
      return listofAnswer;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async validateGetSingleAnswerInput() {
    try {
      if (Boolean(this.req.body.questionnaire_id
          && Boolean(this.req.body.answerer_email))) {
        return true;
      }
      return false;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getSingleAnswer() {
    try {
      const tokenDecoded = await AuthService.tokenValidator(this.req);
      if (!(tokenDecoded.success)) {
        return this.res.status(403).json(tokenDecoded);
      }
      const isInputValid = await this.validateGetSingleAnswerInput();
      if (!(isInputValid)) {
        return this.res.status(400).json({ success: false, message: 'Missing fields detected'});
      }
      const { body } = this.req;
      const queryResult = await AnswerController.getAnswersFromDB(
        body.questionnaire_id,
        body.answerer_email,
      );
      if (typeof queryResult[0] === 'undefined') {
        return this.res.status(200).json({ success: true, message: [] });
      }
      const answerPart = await AnswerController.answerPartFormatter(queryResult);
      const result = {
        questionnaire_id: queryResult[0].questionnaire_id,
        answerer_name: queryResult[0].answerer_name,
        answerer_email: queryResult[0].answerer_email,
        answerer_company: queryResult[0].answerer_company,
        answers: answerPart,
      };
      return this.res.status(200).json({ success: true, message: result });
    } catch (error) {
      return this.res.status(500).json({
        success: false,
        message: error.name,
        detail: error.message,
      });
    }
  }

  static async getScoresFromDB(questionnaireId) {
    try {
      const queryResult = await Scores.findAll({
        where: {
          questionnaire_id: questionnaireId,
        },
      });
      return queryResult;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  static async scorePartFormatter(queryResult) {
    try {
      const result = [];
      for (let i = 0; i < queryResult.length; i++) {
        const object = {};
        object.answerer_email = queryResult[i].answerer_email;
        object.total_score = queryResult[i].total_score;
        result.push(object);
      }
      return result;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async validateGetScoreInput() {
    try {
      if (Boolean(this.req.body.questionnaire_id)) {
        return true;
      }
      return false;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getScores() {
    try {
      const tokenDecoded = await AuthService.tokenValidator(this.req);
      if (!(tokenDecoded.success)) {
        return this.res.status(403).json(tokenDecoded);
      }
      const isInputValid = await this.validateGetScoreInput();
      if (!(isInputValid)) {
        return this.res.status(400).json({ success: false, message: 'Missing fields detected' });
      }
      const { body } = this.req;
      const queryResult = await AnswerController.getScoresFromDB(body.questionnaire_id);
      if (typeof queryResult[0] === 'undefined') {
        return this.res.status(200).json({ success: true, message: [] });
      }
      const scoresPart = await AnswerController.scorePartFormatter(queryResult);
      const result = {
        questionnaire_id: body.questionnaire_id,
        scores: scoresPart,
      };
      return this.res.status(200).json({ success: true, message: result });
    } catch (error) {
      return this.res.status(500).json({
        success: false,
        message: error.name,
        detail: error.message,
      });
    }
  }
}

module.exports = AnswerController;
