const express = require("express");
const cors = require("cors");
const Database = require("better-sqlite3");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3001;

// ========================================
// CARDEXCHANGE SQLITE DATABASE
// ========================================

const DB_PATH =
  process.env.DB_PATH || "/data/sales_counselors.sqlite";


// ========================================
// MIDDLEWARE
// ========================================

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://cclpi.com.ph",
      "https://www.cclpi.com.ph",
      "https://test.cclpi.com.ph",
      "https://www.test.cclpi.com.ph",
    ],
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  })
);

// Allow larger payloads because React may send
// thousands of filtered records.
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
    message:
      "React successfully connected to CardExchange Local Service.",
    time: new Date().toISOString(),
  });
});


// ========================================
// SQLITE CONNECTION TEST
// READ ONLY
// ========================================

app.get("/database-test", (req, res) => {
  let db = null;

  try {
    db = new Database(DB_PATH, {
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
    db = null;

    res.json({
      status: "ok",
      message: "SQLite database connected successfully.",
      database: DB_PATH,
      tables,
    });
  } catch (error) {
    if (db) {
      try {
        db.close();
      } catch {
        // Ignore close error
      }
    }

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
  let db = null;

  try {
    db = new Database(DB_PATH, {
      readonly: true,
    });

    const columns = db
      .prepare(`
        PRAGMA table_info(sales_counselors)
      `)
      .all();

    const count = db
      .prepare(`
        SELECT COUNT(*) AS total
        FROM sales_counselors
      `)
      .get();

    db.close();
    db = null;

    res.json({
      status: "ok",
      table: "sales_counselors",
      totalRecords: count.total,
      columns,
    });
  } catch (error) {
    if (db) {
      try {
        db.close();
      } catch {
        // Ignore close error
      }
    }

    console.error("Schema test error:", error);

    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});


// ========================================
// SYNC FILTERED REACT DATA TO SQLITE
// ========================================

app.post("/sync", (req, res) => {
  let db = null;

  try {
    const records = req.body.records;


    // ========================================
    // VALIDATE RECEIVED DATA
    // ========================================

    if (!Array.isArray(records)) {
      return res.status(400).json({
        status: "error",
        message:
          "Invalid sync data. Expected a records array.",
      });
    }


    // IMPORTANT SAFETY:
    // Do not wipe SQLite when React sends zero rows.
    if (records.length === 0) {
      return res.status(400).json({
        status: "error",
        message:
          "No records to sync. Local database was not changed.",
      });
    }


    console.log("");
    console.log("========================================");
    console.log(" CARDEXCHANGE SYNC STARTED");
    console.log("========================================");
    console.log(`Received records: ${records.length}`);


    // ========================================
    // CHECK DATABASE EXISTS
    // ========================================

    if (!fs.existsSync(DB_PATH)) {
      throw new Error(
        `SQLite database not found: ${DB_PATH}`
      );
    }


    // ========================================
    // CREATE BACKUP FOLDER
    // ========================================

    const databaseFolder = path.dirname(DB_PATH);

    const backupFolder = path.join(
      databaseFolder,
      "backups"
    );

    if (!fs.existsSync(backupFolder)) {
      fs.mkdirSync(backupFolder, {
        recursive: true,
      });
    }


    // ========================================
    // CREATE BACKUP FILE
    // ========================================

    const now = new Date();

    const timestamp = now
      .toISOString()
      .replace(/:/g, "-")
      .replace(/\..+/, "");

    const backupPath = path.join(
      backupFolder,
      `sales_counselors_${timestamp}.sqlite`
    );

    fs.copyFileSync(DB_PATH, backupPath);

    console.log(`Backup created: ${backupPath}`);


    // ========================================
    // OPEN SQLITE DATABASE
    // ========================================

    db = new Database(DB_PATH);


    // ========================================
    // PREPARE INSERT QUERY
    // ========================================

    const insertRecord = db.prepare(`
      INSERT INTO sales_counselors (
        id_no,
        full_name,
        birthday,
        address,
        validity_date,
        is_paid,
        or_date,
        picture,
        signature,
        date_released,
        position,
        manager,
        agency,
        qr_link
      )
      VALUES (
        @id_no,
        @full_name,
        @birthday,
        @address,
        @validity_date,
        @is_paid,
        @or_date,
        @picture,
        @signature,
        @date_released,
        @position,
        @manager,
        @agency,
        @qr_link
      )
    `);


    // ========================================
    // DATABASE TRANSACTION
    // ========================================

    const replaceDatabase = db.transaction((rows) => {

      // Delete current working data.
      db.prepare(`
        DELETE FROM sales_counselors
      `).run();


      // Insert exactly the filtered records
      // received from React.
      for (const row of rows) {
        insertRecord.run({
          id_no: row.id_no ?? "",
          full_name: row.full_name ?? "",
          birthday: row.birthday ?? "",
          address: row.address ?? "",
          validity_date: row.validity_date ?? "",
          is_paid: row.is_paid ?? "",
          or_date: row.or_date ?? "",
          picture: row.picture ?? "",
          signature: row.signature ?? "",
          date_released: row.date_released ?? "",
          position: row.position ?? "",
          manager: row.manager ?? "",
          agency: row.agency ?? "",
          qr_link: row.qr_link ?? "",
        });
      }
    });


    // ========================================
    // EXECUTE TRANSACTION
    // ========================================

    replaceDatabase(records);


    // ========================================
    // VERIFY RECORD COUNT
    // ========================================

    const result = db
      .prepare(`
        SELECT COUNT(*) AS total
        FROM sales_counselors
      `)
      .get();

    const finalTotal = result.total;


    // Extra verification.
    if (finalTotal !== records.length) {
      throw new Error(
        `Record count mismatch. Received ${records.length}, but SQLite contains ${finalTotal}.`
      );
    }


    // ========================================
    // CLOSE DATABASE
    // ========================================

    db.close();
    db = null;


    // ========================================
    // SUCCESS
    // ========================================

    console.log(`SQLite records: ${finalTotal}`);
    console.log(" CARDEXCHANGE SYNC COMPLETED");
    console.log("========================================");
    console.log("");


    res.json({
      status: "ok",
      message:
        "CardExchange database synced successfully.",
      receivedRecords: records.length,
      syncedRecords: finalTotal,
      backupCreated: true,
      backupFile: path.basename(backupPath),
    });

  } catch (error) {

    // ========================================
    // ERROR HANDLING
    // ========================================

    if (db) {
      try {
        db.close();
      } catch {
        // Ignore database close error
      }
    }

    console.error("");
    console.error("========================================");
    console.error(" CARDEXCHANGE SYNC FAILED");
    console.error("========================================");
    console.error(error);
    console.error("");


    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});


// ========================================
// START LOCAL SERVICE
// ========================================

app.listen(PORT, "0.0.0.0", () => {
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