const router = require("express").Router();

const controller = require("../controller/auth.controller");
const validation = require("../verification/auth.validation");

router.post("/verify", validation.verify, controller.verify);
router.post("/logout", validation.logout, controller.logout);

module.exports = router;
