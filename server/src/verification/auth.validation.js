const response = require("../utils/response.helper");
const check = require("../utils/validate.helper");

class authValidation {
  // Auth validation POST - api/auth/verify
  async verify(req, res, next) {
    const schema = {
      type: "object",
      properties: {
        code: {
          type: "number",
          minimum: 100000,
          maximum: 999999,
          errorMessage: {
            type: "Code must be a number",
            minimum: "Code must be at least 6 digits",
            maximum: "Code must be at most 6 digits",
          },
        },
      },
      required: ["code"],
      additionalProperties: false,
      errorMessage: {
        required: { code: "Code is required" },
        additionalProperties: "Invalid request",
      },
    };

    try {
      const validate = await check(schema, req.body);
      if (validate) return response.warning(res, validate);
      next();
    } catch (error) {
      console.error(error);
      return response.error(res, "Validation error occurred");
    }
  }

  // Auth validation POST - api/auth/logout
  async logout(req, res, next) {}
}

module.exports = new authValidation();
