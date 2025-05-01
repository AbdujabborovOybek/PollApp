const mysql = require("../utils/sql.helper");

class authService {
  // Auth service POST - api/auth/verify
  async verify(req, res) {
    console.log("verify");

    return {
      status: "success",
      msg: "Verification successful",
      data: null,
    };
  }

  // Auth service POST - api/auth/logout
  async logout(req, res) {}
}

module.exports = new authService();
