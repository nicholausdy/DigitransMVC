const { publisher } = require('../services/publish.service');
const AuthService = require('../services/auth.service');

class StatisticController {
  constructor(req, res) {
    this.req = req;
    this.res = res;
  }

  async validateStatRequest() {
    try {
      const { body } = this.req;
      if (Boolean(body.questionnaire_id) && (Object.prototype.hasOwnProperty.call(body, 'ind_question_id'))
      && (Object.prototype.hasOwnProperty.call(body, 'dep_question_id'))
      && (Object.prototype.hasOwnProperty.call(body, 'confidence_interval'))) {
        if ((typeof body.questionnaire_id === 'string') && (typeof body.ind_question_id === 'number')
        && (typeof body.dep_question_id === 'number') && (typeof body.confidence_interval === 'number')) {
          return true;
        }
        return false;
      }
      return false;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async validateConfInterval() {
    try {
      const { body } = this.req;
      if (body.confidence_interval < 1 && body.confidence_interval > 0) {
        return true;
      }
      return false;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async requestStat() {
    try {
      const tokenDecoded = await AuthService.tokenValidator(this.req);
      if (!(tokenDecoded.success)) {
        return this.res.status(403).json(tokenDecoded);
      }
      const isInputValid = await this.validateStatRequest();
      if (!(isInputValid)) {
        return this.res.status(400).json({ success: false, message: 'Missing fields detected' });
      }
      const isConfIntervalValid = await this.validateConfInterval();
      if (!(isConfIntervalValid)) {
        return this.res.status(400).json({ success: false, message: 'Allowed confidence interval < 1 and > 0' });
      }
      const data = await publisher.request('statisticCall', this.req.body);
      return this.res.status(200).json(data);
    } catch (error) {
      return this.res.status(500).json({
        success: false,
        message: error.name,
        detail: error.message,
      });
    }
  }

  async validateSpreadsheetRequest() {
    try {
      const { body } = this.req;
      if (Boolean(body.questionnaire_id) && Boolean(body.format)) {
        if ((typeof body.questionnaire_id === 'string') && (typeof body.format === 'string')) {
          return true;
        }
        return false;
      }
      return false;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async validateSpreadsheetFormat() {
    try {
      const { body } = this.req;
      if ((body.format === 'xlsx') || (body.format === 'csv')) {
        return true;
      }
      return false;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async requestSpreadsheet() {
    try {
      const tokenDecoded = await AuthService.tokenValidator(this.req);
      if (!(tokenDecoded.success)) {
        return this.res.status(403).json(tokenDecoded);
      }
      const isInputValid = await this.validateSpreadsheetRequest();
      if (!(isInputValid)) {
        return this.res.status(400).json({ success: false, message: 'Missing fields detected' });
      }
      const isFormatValid = await this.validateSpreadsheetFormat();
      if (!(isFormatValid)) {
        return this.res.status(400).json({ success: false, message: 'Allowed format xlsx or csv' });
      }
      const data = await publisher.request('spreadsheetCall', this.req.body);
      if (!(data.success)) {
        throw new Error(data.message);
      }
      this.res.download(data.message, `response-spreadsheet.${this.req.body.format}`);
      return this.res;
    } catch (error) {
      return this.res.status(500).json({
        success: false,
        message: error.name,
        detail: error.message,
      });
    }
  }

  async validateSampleSizeRequest() {
    try {
      const { body } = this.req;
      if (Boolean(body.population) && Boolean(body.confidence_level)
      && Boolean(body.error_margin)) {
        if ((typeof body.population === 'number') && (typeof body.confidence_level === 'number')
        && (typeof body.error_margin === 'number')) {
          return true;
        }
        return false;
      }
      return false;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async validateConfIntervalForMinSampleSize() {
    try {
      const { body } = this.req;
      if ((body.confidence_level === 0.8) || (body.confidence_level === 0.9)
      || (body.confidence_level === 0.95) || (body.confidence_level === 0.98)
      || (body.confidence_level === 0.99)) {
        return true;
      }
      return false;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async requestMinSampleSize() {
    try {
      const tokenDecoded = await AuthService.tokenValidator(this.req);
      if (!(tokenDecoded.success)) {
        return this.res.status(403).json(tokenDecoded);
      }
      const isInputValid = await this.validateSampleSizeRequest();
      if (!(isInputValid)) {
        return this.res.status(400).json({ success: false, message: 'Missing fields detected' });
      }
      const isConfIntervalValid = await this.validateConfIntervalForMinSampleSize();
      if (!(isConfIntervalValid)) {
        return this.res.status(400).json({ success: false, message: 'Allowed confidence interval 0.8, 0.9, 0.95, 0.98, or 0.99' });
      }
      const data = await publisher.request('samplesizeCall', this.req.body);
      return this.res.status(200).json(data);
    } catch (error) {
      return this.res.status(500).json({
        success: false,
        message: error.name,
        detail: error.message,
      });
    }
  }

  async validateCronbachRequest() {
    try {
      const { body } = this.req;
      if (Boolean(body.questionnaire_id) && Boolean(body.questions_list)) {
        return true;
      }
      return false;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async requestCronbach() {
    try {
      const tokenDecoded = await AuthService.tokenValidator(this.req);
      if (!(tokenDecoded.success)) {
        return this.res.status(403).json(tokenDecoded);
      }
      const isInputValid = await this.validateCronbachRequest();
      if (!(isInputValid)) {
        return this.res.status(400).json({ success: false, message: 'Missing fields detected' });
      }
      const data = await publisher.request('cronbachCall', this.req.body);
      return this.res.status(200).json(data);
    } catch (error) {
      return this.res.status(500).json({
        success: false,
        message: error.name,
        detail: error.message,
      });
    }
  }
}

module.exports = StatisticController;
