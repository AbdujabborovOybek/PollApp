const jwt = require("jsonwebtoken");
const config = require("../config/config");

class jwtHelper {
  async generateAccessToken(payload) {
    return new Promise(async (resolve, reject) => {
      try {
        const token = jwt.sign(payload, config.jwt.access.secret, {
          expiresIn: config.jwt.access.expiresIn,
          audience: "access",
          issuer: "PollApp",
        });
        resolve(token);
      } catch (error) {
        reject(error);
      }
    });
  }

  async generateRefreshToken(payload) {
    return new Promise(async (resolve, reject) => {
      try {
        const token = jwt.sign(payload, config.jwt.refresh.secret, {
          expiresIn: config.jwt.refresh.expiresIn,
          audience: "refresh",
          issuer: "PollApp",
        });
        resolve(token);
      } catch (error) {
        reject(error);
      }
    });
  }

  async verifyAccessToken(token) {
    return new Promise(async (resolve, reject) => {
      try {
        const decoded = jwt.verify(token, config.jwt.access.secret);
        resolve(decoded);
      } catch (error) {
        reject(error);
      }
    });
  }

  async verifyRefreshToken(token) {
    return new Promise(async (resolve, reject) => {
      try {
        const decoded = jwt.verify(token, config.jwt.refresh.secret);
        resolve(decoded);
      } catch (error) {
        reject(error);
      }
    });
  }
}

module.exports = new jwtHelper();
