const e = require("express");
const response = require("../utils/response.helper");
const check = require("../utils/validate.helper");

class pollValidation {
  // Poll validation POST - api/poll/create
  async create(req, res, next) {
    const schema = {
      type: "object",
      properties: {
        question: {
          type: "string",
          minLength: 3,
          maxLength: 255,
          errorMessage: {
            type: "Question must be a string",
            minLength: "Question must be at least 3 characters long",
            maxLength: "Question must be at most 255 characters long",
          },
        },

        poll_type: {
          type: "string",
          enum: ["single_choice", "multiple_choice"],
          errorMessage: {
            type: "Poll type must be a string",
            enum: "Poll type must be either 'single_choice' or 'multiple_choice'",
          },
        },

        type_of_poll: {
          type: "string",
          enum: ["public", "private"],
          errorMessage: {
            type: "Type of poll must be a string",
            enum: "Type of poll must be either 'public' or 'private'",
          },
        },

        start_time: {
          type: "string",
          format: "date-time",
          errorMessage: {
            type: "Start time must be a string",
            format: `Start time must be a valid date-time format (YYYY-MM-DD HH:MM)`,
          },
        },

        end_time: {
          type: "string",
          format: "date-time",
          errorMessage: {
            type: "End time must be a string",
            format: `End time must be a valid date-time format (YYYY-MM-DD HH:MM)`,
          },
        },

        poll_options: {
          type: "array",
          items: {
            type: "string",
            minLength: 1,
            maxLength: 255,
            errorMessage: {
              type: "Poll options must be an array of strings",
              minLength: "Poll option must be at least 1 character long",
              maxLength: "Poll option must be at most 255 characters long",
            },
          },
          minItems: 2,
          maxItems: 10,
          errorMessage: {
            type: "Poll options must be an array of strings",
            minItems: "Poll options must have at least 2 items",
            maxItems: "Poll options must have at most 10 items",
          },
        },
      },

      required: [
        "question",
        "poll_type",
        "type_of_poll",
        "start_time",
        "end_time",
        "poll_options",
      ],
      additionalProperties: false,

      errorMessage: {
        required: {
          question: "Question is required",
          poll_type: "Poll type is required",
          type_of_poll: "Type of poll is required",
          start_time: "Start time is required",
          end_time: "End time is required",
          poll_options: "Poll options are required",
        },
        additionalProperties: `Additional properties are not allowed in the request body`,
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

  // Poll validation GET - api/poll/get
  async get(req, res, next) {
    const schema = {
      type: "object",
      properties: {
        status: {
          type: "string",
          enum: ["all", "active", "pending", "completed", "deleted"],
          errorMessage: {
            type: "Status must be a string",
            enum: "Status must be either 'all', 'active', 'pending', 'completed', or 'deleted'",
          },
        },

        poll_type: {
          type: "string",
          enum: ["all", "single_choice", "multiple_choice"],
          errorMessage: {
            type: "Poll type must be a string",
            enum: "Poll type must be either 'all', 'single_choice', or 'multiple_choice'",
          },
        },
      },
      required: ["status", "poll_type"],
      additionalProperties: false,

      errorMessage: {
        required: {
          status: "Status is required",
          poll_type: "Poll type is required",
        },
        additionalProperties: `Additional properties are not allowed in the request body`,
      },
    };

    try {
      const validate = await check(schema, req.query);
      if (validate) return response.warning(res, validate);
      next();
    } catch (error) {
      console.error(error);
      return response.error(res, "Validation error occurred");
    }
  }

  // Poll validation GET - api/poll/get/:id
  async getById(req, res, next) {
    const schema = {
      type: "object",
      properties: {
        id: {
          type: "string",
          format: "uuid",
          errorMessage: {
            type: "ID must be a string",
            format: "ID must be a valid UUID format",
          },
        },
      },
      required: ["id"],
      additionalProperties: false,
      errorMessage: {
        required: {
          id: "ID is required",
        },
        additionalProperties: `Additional properties are not allowed in the request body`,
      },
    };

    try {
      const validate = await check(schema, req.params);
      if (validate) return response.warning(res, validate);
      next();
    } catch (error) {
      console.error(error);
      return response.error(res, "Validation error occurred");
    }
  }

  // Poll validation PATCH - api/poll/vote/:id
  async vote(req, res, next) {
    const schema = {
      type: "object",
      properties: {
        id: {
          type: "string",
          format: "uuid",
          errorMessage: {
            type: "ID must be a string",
            format: "ID must be a valid UUID format",
          },
        },

        vote: {
          type: "array",
          items: {
            type: "number",
            minimum: 0,
            errorMessage: {
              type: "Poll option ID must be a number",
              minimum: "Poll option ID must be at least 0",
            },
          },

          minItems: 1,
          errorMessage: {
            type: "Poll option ID must be an array of numbers",
            minItems: "Poll option ID must have at least 1 item",
          },
        },
      },
      required: ["id", "vote"],
      additionalProperties: false,
      errorMessage: {
        required: {
          id: "ID is required",
          vote: "Vote is required",
        },
        additionalProperties: `Additional properties are not allowed in the request body`,
      },
    };

    try {
      const validate = await check(schema, { ...req.body, ...req.params });
      if (validate) return response.warning(res, validate);
      next();
    } catch (error) {
      console.error(error);
      return response.error(res, "Validation error occurred");
    }
  }
}

module.exports = new pollValidation();

// {
//   question: 'test',
//   poll_type: 'single_choice',
//   type_of_poll: 'public',
//   start_time: '2025-04-10 00:00',
//   end_time: '2025-04-10 00:00',
//   poll_options: [ '1 javob', '3 javob', '3 javob' ]
// }
