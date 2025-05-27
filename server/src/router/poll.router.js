const router = require("express").Router();

const controller = require("../controller/poll.controller");
const validation = require("../verification/poll.vatidation");

router.post("/create", validation.create, controller.create);
router.get("/get", validation.get, controller.get);
router.get("/get/:id", validation.getById, controller.getById);
router.patch("/vote/:id", validation.vote, controller.vote);

module.exports = router;
