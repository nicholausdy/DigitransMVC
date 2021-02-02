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
}

module.exports = StatisticController;
