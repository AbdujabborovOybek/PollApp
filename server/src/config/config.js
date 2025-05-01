require("dotenv").config();

module.exports = {
  // MySQL database configuration
  db: {
    host: process.env.MYSQL_HOST || "localhost",
    user: process.env.MYSQL_USER || "root",
    password: process.env.MYSQL_PASSWORD || "root",
    database: process.env.MYSQL_DATABASE || "test",
  },

  // JWT secret key
  jwt: {
    access: {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: "15m",
    },

    refresh: {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: "30d",
    },
  },

  // Telegram bot token
  telegram: {
    token: process.env.TELEGRAM_BOT_TOKEN,
  },

  // Cors configuration
  cors: {
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  },
};
