const AuthService = require('../services/auth.service');
const { Subscription } = require('../models/Subscription');

class SubscriptionController {
  constructor(req, res) {
    this.req = req;
    this.res = res;
  }

  async validateSubscriptionInput() {
    try {
      if (Boolean(this.req.body.email)) {
        return true;
      }
      return false;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async createSubscription() {
    try {
      const isInputValid = await this.validateSubscriptionInput();
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
      const result = await Subscription.create({ email: this.req.body.email });
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

module.exports = SubscriptionController;
