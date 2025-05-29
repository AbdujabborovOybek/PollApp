const router = require("express").Router();
const { rateLimit } = require("express-rate-limit");

const controller = require("../controller/auth.controller");
const validation = require("../verification/auth.validation");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 30, // Limit each IP to 3 requests per `window` (here, per 15 minutes).
  standardHeaders: "draft-8", // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  message: {
    variant: "info",
    message: "Too many requests, please try again later.",
  },
});

router.post("/verify", limiter, validation.verify, controller.verify);
router.post("/logout", controller.logout);

module.exports = router;
