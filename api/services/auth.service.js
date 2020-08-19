const TokenService = require('./token.service');

class AuthService {
  static async tokenValidator(req) {
    try {
      const tokenString = req.headers['x-access-token'] || req.headers.authorization;
      const isHeaderValid = Boolean(tokenString);
      if (!(isHeaderValid)) {
        return { success: false, message: 'No auth header' };
      }
      let token;
      const tokenParts = tokenString.split(' ');
      if (tokenParts.length === 2) {
        if (tokenParts[0] !== 'Bearer') {
          return { success: false, message: 'Format should be Authorization:Bearer <token> or Authorization:<token>' };
        }
        token = tokenParts[1];
      } else if (tokenParts.length === 1) {
        token = tokenParts[0];
      } else {
        return { success: false, message: 'Format should be Authorization:Bearer <token> or Authorization:<token>' };
      }
      const decodedToken = await TokenService.verify(token);
      return { success: true, message: decodedToken };
    } catch (error) {
      return { success: false, message: error.name, detail: error.message };
    }
  }
}

module.exports = AuthService;
