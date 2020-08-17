const { User } = require('../models/User');
const HashService = require('../services/hash.service');
const TokenService = require('../services/token.service');
const NATSPublisher = require('../services/publish.service');

const publisher = new NATSPublisher();

(async () => {
  await publisher.connect();
})();

class UserController {
  constructor(req, res) {
    this.req = req;
    this.res = res;
  }

  async validateRegisterInput() {
    try {
      if (Boolean(this.req.body.email)
      && (Boolean(this.req.body.password))
      && (Boolean(this.req.body.password1))
      && (Boolean(this.req.body.institution))
      && (Boolean(this.req.body.name))
      && (Boolean(this.req.body.job))) {
        return true;
      }
      return false;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async register() {
    try {
      const isInputValid = await this.validateRegisterInput();
      if (!(isInputValid)) {
        return this.res.status(400).json({ success: false, message: 'Missing fields detected' });
      }
      if (this.req.body.password !== this.req.body.password1) {
        return this.res.status(400).json({ success: false, message: 'Mismatched password' });
      }
      const hashedPassword = await HashService.hash(this.req.body.password);
      const record = {
        Email: this.req.body.email,
        Password: hashedPassword,
        Institution: this.req.body.institution,
        Name: this.req.body.name,
        PhoneNumber: this.req.body.phone_number,
        Job: this.req.body.job,
        IsVerified: false,
      };

      const [newUser, tokenForMail] = await Promise.all([
        User.create(record),
        TokenService.issue({ email: this.req.body.email })]);

      await publisher.publish('mailCall', { email: this.req.body.email, type: 'verification', token: tokenForMail });
      return this.res.status(200).json({ success: true, message: 'Registraton successful. Please check your email' });
    } catch (error) {
      console.log(error);
      return this.res.status(500).json({
        success: false,
        message: error.name,
        detail: error.message,
      });
    }
  }

  async verify() {
    try {
      const decodedToken = await TokenService.verify(this.req.params.token);
      await User.update({ IsVerified: true }, {
        where: {
          Email: decodedToken.email,
        },
      });
      return this.res.status(200).json({ success: true, message: 'Account has been verified' });
    } catch (error) {
      return this.res.status(500).json({
        success: false,
        message: error.name,
        detail: error.message,
      });
    }
  }

  async validateLoginInput() {
    try {
      if (Boolean(this.req.body.email) && Boolean(this.req.body.password)) {
        return true;
      }
      return false;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async login() {
    try {
      const isInputValid = await this.validateLoginInput();
      if (!(isInputValid)) {
        return this.res.status(400).json({ success: false, message: 'Missing fields detected' });
      }
      const user = await User.findByPk(this.req.body.email);
      if (user === null) {
        return this.res.status(404).json({ success: false, message: 'User not found' });
      }
      if (!(user.IsVerified)) {
        return this.res.status(404).json({ success: false, message: 'User not verified yet' });
      }
      const isHashValid = await HashService.compare(this.req.body.password, user.Password);
      if (!(isHashValid)) {
        return this.res.status(403).json({ success: false, message: 'Incorrect password' });
      }
      const token = await TokenService.issue({ email: this.req.body.email });
      return this.res.status(200).json({ success: true, message: token });
    } catch (error) {
      console.log(error);
      return this.res.status(500).json({
        success: false,
        message: error.name,
        detail: error.message,
      });
    }
  }
}

module.exports = UserController;
