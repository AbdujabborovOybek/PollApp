const Ajv = require("ajv");
const ajv = new Ajv({ allErrors: true });
require("ajv-errors")(ajv);
require("ajv-formats")(ajv);

const validator = (schema, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const validate = ajv.compile(schema);
      const valid = validate(data);
      if (valid) return resolve(null);
      return resolve(validate.errors[0].message);
    } catch (error) {
      return reject(error);
    }
  });
};

module.exports = validator;
