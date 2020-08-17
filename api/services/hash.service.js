const bcrypt = require('bcrypt');

class HashService {
  static async hash(plainText) {
    try {
      const saltRounds = 10;
      const hashedText = await bcrypt.hash(plainText, saltRounds);
      return hashedText;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  static async compare(plainText, hash) {
    try {
      const resultBool = await bcrypt.compare(plainText, hash);
      return resultBool;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

module.exports = HashService;
