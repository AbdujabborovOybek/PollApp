const response = require("../utils/response.helper");
const authService = require("../service/auth.service");

class authController {
  // Auth controller POST - api/auth/verify
  async verify(req, res) {
    try {
      const result = await authService.verify(req, res);
      const { status, msg, data } = result;
      return response[status](res, msg, data);
    } catch (error) {
      console.error(error);
      const msg = "An error occurred while processing your request";
      return response.error(res, msg);
    }
  }

  // Auth controller POST - api/auth/logout
  async logout(req, res) {}
}

module.exports = new authController();
