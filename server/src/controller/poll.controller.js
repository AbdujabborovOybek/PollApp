const response = require("../utils/response.helper");
const pollService = require("../service/poll.service");

class pollController {
  // Poll controller GET - api/poll/create
  async create(req, res) {
    try {
      const result = await pollService.create(req, res);
      const { status, msg, data } = result;
      return response[status](res, msg, data);
    } catch (error) {
      console.error(error);
      const msg = "An error occurred while processing your request";
      return response.error(res, msg);
    }
  }

  // Poll controller GET - api/poll/get
  async get(req, res) {
    try {
      const result = await pollService.get(req, res);
      const { status, msg, data } = result;
      return response[status](res, msg, data);
    } catch (error) {
      console.error(error);
      const msg = "An error occurred while processing your request";
      return response.error(res, msg);
    }
  }

  // Poll controller GET - api/poll/get/:id
  async getById(req, res) {
    try {
      const result = await pollService.getById(req, res);
      const { status, msg, data } = result;
      return response[status](res, msg, data);
    } catch (error) {
      console.error(error);
      const msg = "An error occurred while processing your request";
      return response.error(res, msg);
    }
  }

  // Poll controller PATCH - api/poll/vote/:id
  async vote(req, res) {
    try {
      const result = await pollService.vote(req, res);
      const { status, msg, data } = result;
      return response[status](res, msg, data);
    } catch (error) {
      console.error(error);
      const msg = "An error occurred while processing your request";
      return response.error(res, msg);
    }
  }
}

module.exports = new pollController();
