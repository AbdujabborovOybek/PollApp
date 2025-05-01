const mysql = require("mysql2");
const config = require("../config/config");

const pool = mysql.createPool({
  host: config.db.host,
  user: config.db.user,
  password: config.db.password,
  database: config.db.database,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  multipleStatements: true,
});

// Pooldan ulanish olinganligini tekshirish.
pool.getConnection((err, connection) => {
  if (err) {
    console.error("❌ Error connecting to MySQL database:", err);
    return;
  }
  console.log("✅ Successfully connected to MySQL database!");
  connection.release();
});

module.exports = pool.promise();
