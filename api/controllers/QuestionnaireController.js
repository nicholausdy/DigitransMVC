const AuthService = require('../services/auth.service');
const { Questionnaire } = require('../models/Questionnaire');
const { Scores } = require('../models/Scores');
const HashService = require('../services/hash.service');
const Scores = require('../models/Scores');

class QuestionnaireController {
  constructor(req, res) {
    this.req = req;
    this.res = res;
  }

  async validateCreateQuestionnaire() {
    try {
      if (Boolean(this.req.body.email)
        && Boolean(this.req.body.questionnaire_title)
        && Boolean(this.req.body.questionnaire_desc)
      ) {
        return true;
      }
      return false;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async createQuestionnaire() {
    try {
      const isInputValid = await this.validateCreateQuestionnaire();
      if (!(isInputValid)) {
        return this.res.status(400).json({ success: false, message: 'Missing fields detected' });
      }
      const tokenDecoded = await AuthService.tokenValidator(this.req);
      if (!(tokenDecoded.success)) {
        return this.res.status(403).json(tokenDecoded);
      }
      if (tokenDecoded.message.email !== this.req.body.email) {
        return this.res.status(404).json({ success: false, message: 'Invalid token for current user' });
      }
      const { body } = this.req;
      const questionnaireId = await HashService.hash(body.email.concat(body.questionnaire_title));
      const record = {
        Email: body.email,
        QuestionnaireTitle: body.questionnaire_title,
        QuestionnaireDescription: body.questionnaire_desc,
        QuestionnaireId: questionnaireId,
      };
      const newRecord = await Questionnaire.create(record);
      return this.res.status(200).json({ success: true, message: newRecord.QuestionnaireId });
    } catch (error) {
      return this.res.status(500).json({
        success: false,
        message: error.name,
        detail: error.message,
      });
    }
  }

  async validateUpdateQuestionnaire() {
    try {
      if (Boolean(this.req.body.questionnaire_id)
        && Boolean(this.req.body.questionnaire_title)
        && Boolean(this.req.body.questionnaire_desc)
      ) {
        return true;
      }
      return false;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async updateQuestionnaire() {
    try {
      const isInputValid = await this.validateUpdateQuestionnaire();
      if (!(isInputValid)) {
        return this.res.status(400).json({ success: false, message: 'Missing fields detected' });
      }
      const tokenDecoded = await AuthService.tokenValidator(this.req);
      if (!(tokenDecoded.success)) {
        return this.res.status(403).json(tokenDecoded);
      }
      const { body } = this.req;
      const record = {
        QuestionnaireTitle: body.questionnaire_title,
        QuestionnaireDescription: body.questionnaire_desc,
      };
      const [numberOfRows, affectedRows] = await Questionnaire.update(record,
        {
          where: { QuestionnaireId: body.questionnaire_id },
          returning: true,
        });
      return this.res.status(200).json({ success: true, message: { numberOfRows, affectedRows } });
    } catch (error) {
      return this.res.status(500).json({
        success: false,
        message: error.name,
        detail: error.message,
      });
    }
  }

  async validateGetQuestionnaire(fieldName) {
    try {
      if (Boolean(this.req.body[fieldName])) {
        return true;
      }
      return false;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getQuestionnaire() {
    try {
      const isInputValid = await this.validateGetQuestionnaire('email');
      if (!(isInputValid)) {
        return this.res.status(400).json({ success: false, message: 'Missing fields detected' });
      }
      const tokenDecoded = await AuthService.tokenValidator(this.req);
      if (!(tokenDecoded.success)) {
        return this.res.status(403).json(tokenDecoded);
      }
      if (tokenDecoded.message.email !== this.req.body.email) {
        return this.res.status(404).json({ success: false, message: 'Invalid token for current user' });
      }
      const result = await Questionnaire.findAll({
        attributes: {
          exclude: ['Email'],
        },
        where: {
          Email: this.req.body.email,
        },
      });
      return this.res.status(200).json({ success: true, message: result });
    } catch (error) {
      return this.res.status(500).json({
        success: false,
        message: error.name,
        detail: error.message,
      });
    }
  }

  async getQuestionnaireById() {
    try {
      const isInputValid = await this.validateGetQuestionnaire('questionnaire_id');
      if (!(isInputValid)) {
        return this.res.status(400).json({ success: false, message: 'Missing fields detected' });
      }
      const result = await Questionnaire.findByPk(this.req.body.questionnaire_id);
      return this.res.status(200).json({ success: true, message: result });
    } catch (error) {
      return this.res.status(500).json({
        success: false,
        message: error.name,
        detail: error.message,
      });
    }
  }

  async deleteQuestionnaireById() {
    try {
      const isInputValid = await this.validateGetQuestionnaire('questionnaire_id');
      if (!(isInputValid)) {
        return this.res.status(400).json({ success: false, message: 'Missing fields detected' });
      }
      const tokenDecoded = await AuthService.tokenValidator(this.req);
      if (!(tokenDecoded.success)) {
        return this.res.status(403).json(tokenDecoded);
      }
      const deleteQuestionnaire = Questionnaire.destroy({
        where: {
          QuestionnaireId: this.req.body.questionnaire_id,
        },
      });
      const deleteScores = Scores.destroy({
        where: {
          questionnaire_id: this.req.body.questionnaire_id,
        },
      });
      await Promise.all([deleteQuestionnaire, deleteScores]);
      return this.res.status(200).json({ success: true, message: 'Delete successful' });
    } catch (error) {
      return this.res.status(500).json({
        success: false,
        message: error.name,
        detail: error.message,
      });
    }
  }
}

module.exports = QuestionnaireController;
