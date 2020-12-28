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

  async sendFutureDeletionNotification() {
    try {
      const options = {
        email: this.email,
        subject: '[Digitrans] Peringatan Penghapusan Kuesioner',
        text: 'Beberapa kuesioner Anda akan dihapus dua hari dari sekarang. \nMohon aktifkan fitur langganan agar kuesioner tetap dapat diakses',
      };
      const mailResult = await MailerService.sendMail(options);
      console.log(mailResult);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async sendDeletionNotification() {
    try {
      const options = {
        email: this.email,
        subject: '[Digitrans] Notifikasi Penghapusan Kuesioner',
        text: 'Mohon maaf, beberapa kuesioner Anda sudah dihapus karena sudah melewati batas waktu penyimpanan 1 minggu.\n Mohon aktifkan fitur langganan agar kuesioner yang dibuat tetap dapat diakses selamanya',
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
      } else if (this.type === 'futureDeletionNotification') {
        await this.sendFutureDeletionNotification();
      } else if (this.type === 'deletionNotification') {
        await this.sendDeletionNotification();
      } else {
        throw new Error('Invalid mailer type');
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

module.exports = MailHandler;
