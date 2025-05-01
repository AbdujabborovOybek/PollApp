const express = require("express");
const cors = require("cors");
const PORT = process.env.PORT || 8080;
const cookieParser = require("cookie-parser");
require("./sql/initialize");
const app = express();
const config = require("./config/config");
require("./bot");

app.use(express.json());
app.use(cookieParser());
app.use(cors(config.cors));

app.use("/api/auth", require("./router/auth.router"));

// 404 error handling middleware
app.use((req, res, next) => {
  return res.status(404).json({
    message: `${req.method} ${req.originalUrl} not found`,
  });
});

app.listen(PORT, () => console.log(`✅ Server is running on port ${PORT}`));
