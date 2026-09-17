const express = require("express");
const cors = require("cors");
const Database = require("better-sqlite3");

const app = express();
const PORT = 3001;

const DB_PATH =
  "C:\\Users\\ASUS\\Desktop\\ID\\Sales Counselor\\database\\sales_counselors.sqlite";


// ========================================
// MIDDLEWARE
// ========================================

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://cclpi.com.ph",
      "https://www.cclpi.com.ph",
    ],
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  })
);

app.use(express.json({ limit: "50mb" }));


// ========================================
// LOCAL SERVICE TEST
// ========================================

app.get("/", (req, res) => {
  res.json({
    status: "ok",
    service: "CardExchange Local Service",
    message: "Local service is running.",
  });
});


// ========================================
// REACT → LOCAL SERVICE CONNECTION TEST
// ========================================

app.get("/connection-test", (req, res) => {
  console.log("Connection test received.");

  res.json({
    status: "ok",
    message: "React successfully connected to CardExchange Local Service.",
    time: new Date().toISOString(),
  });
});


// ========================================
// SQLITE CONNECTION TEST
// READ ONLY — DOES NOT MODIFY DATABASE
// ========================================

app.get("/database-test", (req, res) => {
  try {
    const db = new Database(DB_PATH, {
      readonly: true,
    });

    const tables = db
      .prepare(`
        SELECT name
        FROM sqlite_master
        WHERE type = 'table'
      `)
      .all();

    db.close();

    res.json({
      status: "ok",
      message: "SQLite database connected successfully.",
      database: DB_PATH,
      tables,
    });

  } catch (error) {
    console.error("Database test error:", error);

    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});


// ========================================
// DATABASE SCHEMA TEST
// READ ONLY
// ========================================

app.get("/database-schema", (req, res) => {
  try {
    const db = new Database(DB_PATH, {
      readonly: true,
    });

    const columns = db
      .prepare("PRAGMA table_info(sales_counselors)")
      .all();

    const count = db
      .prepare("SELECT COUNT(*) AS total FROM sales_counselors")
      .get();

    db.close();

    res.json({
      status: "ok",
      table: "sales_counselors",
      totalRecords: count.total,
      columns,
    });

  } catch (error) {
    console.error("Schema test error:", error);

    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});


// ========================================
// START LOCAL SERVICE
// ========================================

app.listen(PORT, "127.0.0.1", () => {
  console.log("");
  console.log("========================================");
  console.log(" CardExchange Local Service");
  console.log("========================================");
  console.log(` Running: http://localhost:${PORT}`);
  console.log(` Database: ${DB_PATH}`);
  console.log(" Waiting for React...");
  console.log("========================================");
  console.log("");
});