const jwt = require('jsonwebtoken');
const config = require('../../config/index');

class TokenService {
  static async issue(data, expiresIn) {
    try {
      return new Promise((resolve, reject) => {
        jwt.sign(data, config.jwtPass, { expiresIn }, (error, token) => {
          if (error) {
            reject(error);
          }
          resolve(token);
        });
      });
    } catch (error) {
      throw new Error(error.message);
    }
  }

  static async verify(token) {
    try {
      return new Promise((resolve, reject) => {
        jwt.verify(token, config.jwtPass, (error, decoded) => {
          if (error) {
            reject(error);
          }
          resolve(decoded);
        });
      });
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

module.exports = TokenService;
