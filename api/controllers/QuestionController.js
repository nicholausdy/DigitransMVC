const AuthService = require('../services/auth.service');
const { Questions } = require('../models/Questions');
const { Options } = require('../models/Options');

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

  static async parallelOptionsInsert(listOflist, questionModel) {
    try {
      const result = [];
      for (let i = 0; i < listOflist.length; i++ ) {
        const asyncOp = questionModel.bulkCreate(listOflist[i]);
        result.push(asyncOp)
      }
      await Promise.all(result);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async createQuestions() {
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
      await Questions.bulkCreate(listOfQuestionsOnly);
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
      await QuestionController.parallelOptionsInsert(optionsToBeInserted, Options);
      return this.res.status(200).json({ success: true, message: 'Questions saved'})
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