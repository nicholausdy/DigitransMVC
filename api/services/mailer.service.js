const nodemailer = require('nodemailer');
const config = require('../../config/index');

// { email: string,  subject: string, text: string}
class MailerService {
  static async sendMail(options) {
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: config.mailer.username,
          pass: config.mailer.password,
        },
      });

      const mailOptions = {
        from: config.mailer.username,
        to: options.email,
        subject: options.subject,
        text: options.text,
      };

      const mailerResult = await transporter.sendMail(mailOptions);
      return mailerResult;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

module.exports = MailerService;
