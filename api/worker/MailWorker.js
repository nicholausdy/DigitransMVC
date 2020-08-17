const MailerService = require('../services/mailer.service');
const config = require('../../config/index');

class MailHandler {
  constructor(email, type, token) {
    this.email = email;
    this.type = type;
    this.token = token;
  }

  async sendVerification() {
    try {
      const url = config.hostURL.concat('private/user/verification/', this.token);
      const options = {
        email: this.email,
        subject: 'Verify Your Digitrans Questionnaire Platform Account',
        text: 'Thank you for registering your account for the first time.\nClick this link to verify your account (link will expire in 1 hour): '.concat(url),
      };
      const mailResult = await MailerService.sendMail(options);
      console.log(mailResult);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async send() {
    try {
      if (this.type === 'verification') {
        await this.sendVerification();
      } else {
        throw new Error('Invalid mailer type');
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

module.exports = MailHandler;
