const fs = require("fs");
const path = require("path");
const pool = require("./connection"); // MySQL connection pool from connection.js

async function initializeDatabase() {
  try {
    // init.sql faylini o'qib olish
    const sqlFilePath = path.join(__dirname, "db.sql");
    const sql = fs.readFileSync(sqlFilePath, { encoding: "utf8" });

    // SQL skriptini ishga tushurish (multipleStatements: true orqali bir nechta bayonot bajariladi)
    await pool.query(sql);
    console.log("✅ Database initialized successfully!");
  } catch (err) {
    console.error("❌ Error initializing database:", err);
  }
}

// Initialization funksiyasini ishga tushiramiz
initializeDatabase();
