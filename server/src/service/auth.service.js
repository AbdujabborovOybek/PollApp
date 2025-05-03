const { query } = require("../utils/sql.helper");
const { v4: uuidv4 } = require("uuid");
const jwtHelper = require("../utils/jwt.helper");

class authService {
  // Auth service POST - api/auth/verify
  async verify(req, res) {
    const { code } = req.body;

    const sqlGetVerifyData = `SELECT * FROM verification_codes WHERE code = ? AND is_used = 0`;
    const verifyData = await query(sqlGetVerifyData, [code]);

    if (!verifyData.length) {
      return {
        status: "warning",
        msg: "Verification code is invalid or has already been used",
      };
    }

    // if action is register
    if (verifyData[0]?.action === "register") {
      const payload = {
        id: uuidv4(),
        telegram_id: verifyData[0].telegram_id,
        ...verifyData[0].data,
      };

      const sqlInsertUser = `INSERT INTO users SET ?`;
      const insertUserResult = await query(sqlInsertUser, [payload]);

      if (insertUserResult.affectedRows) {
        const set = { user_id: payload.id, telegram_id: payload.telegram_id };

        const sqlUpdateIsUsed = `UPDATE verification_codes SET is_used = 1, confirmed_at = NOW() WHERE code = ?`;
        await query(sqlUpdateIsUsed, [code]);

        const accessToken = await jwtHelper.generateAccessToken(set);
        res.cookie("access_token", accessToken, {
          path: "/",
          httpOnly: true,
          secure: true,
          sameSite: "none",
          maxAge: 15 * 60 * 1000, // 15 minutes
        });

        const refreshToken = await jwtHelper.generateRefreshToken(set);
        res.cookie("refresh_token", refreshToken, {
          path: "/",
          httpOnly: true,
          secure: true,
          sameSite: "none",
          maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        });

        const sqlGetUser = `SELECT * FROM users WHERE id = ?`;
        const userData = await query(sqlGetUser, [payload.id]);

        return {
          status: "success",
          msg: "Welcome to the PollApp",
          data: userData[0],
        };
      }
    }

    // if action is login
    if (verifyData[0]?.action === "login") {
      const sqlGetUser = `SELECT * FROM users WHERE telegram_id = ?`;
      const userData = await query(sqlGetUser, [verifyData[0].telegram_id]);
      if (!userData.length) {
        return {
          status: "warning",
          msg: "User not found",
          data: null,
        };
      }

      const { id, telegram_id } = userData[0];
      const set = { user_id: id, telegram_id };

      const sqlUpdateIsUsed = `UPDATE verification_codes SET is_used = 1, confirmed_at = NOW() WHERE code = ?`;
      await query(sqlUpdateIsUsed, [code]);

      const accessToken = await jwtHelper.generateAccessToken(set);
      res.cookie("access_token", accessToken, {
        path: "/",
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 15 * 60 * 1000, // 15 minutes
      });

      const refreshToken = await jwtHelper.generateRefreshToken(set);
      res.cookie("refresh_token", refreshToken, {
        path: "/",
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      });

      return {
        status: "success",
        msg: "Welcome back to the PollApp",
        data: userData[0],
      };
    }

    return {
      status: "warning",
      msg: "Verification code is invalid or has already been used",
      data: null,
    };
  }

  // Auth service POST - api/auth/logout
  async logout(req, res) {
    res.clearCookie("access_token");
    res.clearCookie("refresh_token");

    return {
      status: "success",
      msg: "Logout successful",
    };
  }
}

module.exports = new authService();
