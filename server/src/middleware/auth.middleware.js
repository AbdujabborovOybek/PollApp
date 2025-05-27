const response = require("../utils/response.helper");
const jwt = require("../utils/jwt.helper");

// Helper to set the access token cookie
const setCookie = (res, type, token, exp) => {
  res.cookie(type, token, {
    path: "/",
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: exp,
  });
};

const auth = async (req, res, next) => {
  // Skip authentication for public routes
  if (req.path.includes("/auth")) return next();
  const { access_token, refresh_token } = req.cookies;

  if (access_token) {
    const decoded = await jwt.verifyAccessToken(access_token);
    if (decoded) {
      req.user = decoded;
      return next();
    }
  }

  if (refresh_token) {
    const decoded = await jwt.verifyRefreshToken(refresh_token);
    if (decoded) {
      const { user_id, telegram_id } = decoded;
      const set = { user_id, telegram_id };
      const newAccessToken = await jwt.generateAccessToken(set);
      const exp = 15 * 60 * 1000; // 15 minutes
      setCookie(res, "access_token", newAccessToken, exp);
      req.user = set;
      return next();
    }

    // If refresh token is invalid, clear the cookies
    res.clearCookie("access_token");
    res.clearCookie("refresh_token");
    return response.error(res, 401, "Invalid refresh token");
  }

  // If no tokens are present, clear the cookies
  res.clearCookie("access_token");
  res.clearCookie("refresh_token");
  return response.error(res, 401, "Unauthorized");
};

module.exports = auth;
