const { QueryTypes } = require('sequelize');
const AuthService = require('../services/auth.service');
const { Questions } = require('../models/Questions');
const { Options } = require('../models/Options');
const { db } = require('../../config/database');

class QuestionController {
  constructor(req, res) {
    this.req = req;
    this.res = res;
  }

  static async getListOfQuestions(questionnaireId, questionPart) {
    try {
      const result = [];
      for ( let i = 0; i < questionPart.length; i++) {
        const questionObject = {};
        questionObject.questionnaire_id = questionnaireId;
        questionObject.question_id = i;
        questionObject.question_description = questionPart[i].question_description;
        questionObject.type = questionPart[i].type;
        questionObject.isrequired = questionPart[i].isrequired;
        result.push(questionObject);
      }
      return result;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  static async getListOfOptions(questionnaireId, questionId, optionPart) {
    try {
      const result = [];
      for ( let i = 0; i < optionPart.length; i++ ) {
        const optionObject = {};
        optionObject.questionnaire_id = questionnaireId;
        optionObject.question_id = questionId;
        optionObject.option_id = i;
        optionObject.description = optionPart[i].description;
        optionObject.score = optionPart[i].score;
        optionObject.number_chosen = 0;
        result.push(optionObject);
      }
      return result;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  static async parallelGetListOfOptions(questionnaireId, questionPart) {
    try {
      const result = [];
      for ( let i = 0; i < questionPart.length; i++) {
        if (Boolean(questionPart[i].options)) {
          const optionPart = questionPart[i].options;
          const listOfOptionsOnly = QuestionController.getListOfOptions(
            questionnaireId, i, optionPart
          )
          result.push(listOfOptionsOnly);
        }
      }
      const final = await Promise.all(result);
      return final;
    }
    catch (error) {
      throw new Error(error.message);
    }
  }

  async validateQuestions() {
    try {
      if (Boolean(this.req.body.questionnaire_id)
          && Boolean(this.req.body.questions)) {
        return true;
      }
      return false;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  static async parallelOptionsInsert(listOflist, optionModel, isUpsert) {
    try {
      const result = [];
      for (let i = 0; i < listOflist.length; i++) {
        if (!(isUpsert)) {
          const asyncOp = optionModel.bulkCreate(listOflist[i]);
          result.push(asyncOp);
        } else {
          const asyncOp = optionModel.bulkCreate(listOflist[i], {
            updateOnDuplicate: ['description', 'score']
          });
          result.push(asyncOp);
        }
      }
      await Promise.all(result);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async createQuestions(isUpsert) {
    try {
      const tokenDecoded = await AuthService.tokenValidator(this.req);
      if (!(tokenDecoded.success)) {
        return this.res.status(403).json(tokenDecoded);
      }
      const isInputValid = await this.validateQuestions();
      if (!(isInputValid)) {
        return this.res.status(400).json({ success: false, message: 'Missing fields detected'});
      }
      const { body } = this.req;
      const questionPart = body.questions 
      const listOfQuestionsOnly = await QuestionController.getListOfQuestions(body.questionnaire_id,
        questionPart);
      if (!(isUpsert)) {
        await Questions.bulkCreate(listOfQuestionsOnly);
      } else {
        await Questions.bulkCreate(listOfQuestionsOnly,
          {
            updateOnDuplicate: ['question_description', 'type', 'isrequired']
          });
      }
      // for ( let i = 0; i < questionPart.length; i++) {
      //  if (Boolean(questionPart[i].options)) {
      //    const optionPart = questionPart[i].options;
      //    const listOfOptionsOnly = await QuestionController.getListOfOptions(
      //      body.questionnaire_id, i, optionPart 
      //    )
      //    await Options.bulkCreate(listOfOptionsOnly);
      //  }
      // }
      const optionsToBeInserted = await QuestionController.parallelGetListOfOptions(
        body.questionnaire_id, questionPart)
      await QuestionController.parallelOptionsInsert(optionsToBeInserted, Options, isUpsert);
      return this.res.status(200).json({ success: true, message: 'Questions saved'});
    } catch (error) {
      return this.res.status(500).json({
        success: false,
        message: error.name,
        detail: error.message,
      });
    }
  }

  static async getQuestionsByQuestionnaireId(questionnaireId) {
    try {
      const queryString = ` select question_id, question_description, type, isrequired from 
        questionnaire inner join questions on 
        questionnaire.questionnaire_id = questions.questionnaire_id 
        where questions.questionnaire_id = :questionnaire_id 
        order by question_id `;

      const queryResult = await db.query(queryString, {
        replacements: { questionnaire_id: questionnaireId },
        type: QueryTypes.SELECT,
      });

      return queryResult;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  static async getOptionsByQuestionId(questionnaireId, questionId) {
    try {
      const queryString = ` select option_id, description, score from options 
        where questionnaire_id = :questionnaire_id AND question_id = :question_id 
        order by option_id `;

      const queryResult = await db.query(queryString, {
        replacements: {
          questionnaire_id: questionnaireId,
          question_id: questionId,
        },
        type: QueryTypes.SELECT,
      });

      return queryResult;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  static async listOfAllOptions (questionnaireId, listOfQuestions) {
    try {
      const asyncOp = [];
      for (let i = 0 ; i < listOfQuestions.length; i++) {
        const listOfOptions = QuestionController.getOptionsByQuestionId(questionnaireId, i);
        asyncOp.push(listOfOptions);
      }
      const final = await Promise.all(asyncOp);
      final.sort((a, b) => a - b); // sort ascending
      return final;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async validateGetQuestionInput() {
    try {
      if (Boolean(this.req.body.questionnaire_id)) {
        return true;
      }
      return false;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getQuestions() {
    try {
      const tokenDecoded = await AuthService.tokenValidator(this.req);
      if (!(tokenDecoded.success)) {
        return this.res.status(403).json(tokenDecoded);
      }
      const isInputValid = await this.validateGetQuestionInput();
      if (!(isInputValid)) {
        return this.res.status(400).json({ success: false, message: 'Missing fields detected'});
      }
      const listOfQuestions = await QuestionController.getQuestionsByQuestionnaireId( 
        this.req.body.questionnaire_id 
      );
      if (typeof listOfQuestions[0] === 'undefined') {
        return this.res.status(200).json({ success: true, message: listOfQuestions });
      }

      const listOfListOptions = await QuestionController.listOfAllOptions(
        this.req.body.questionnaire_id,
        listOfQuestions
      );

      for (let i = 0; i < listOfListOptions.length; i++) {
        listOfQuestions[i].options = listOfListOptions[i];
      }

      const result = { 
        questionnaire_id: this.req.body.questionnaire_id,
        questions: listOfQuestions,
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

module.exports = QuestionController;