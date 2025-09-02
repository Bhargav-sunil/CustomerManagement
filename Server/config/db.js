const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.resolve(__dirname, "../db/database.sqlite");

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.log("Error connecting to database", err);
  } else {
    console.log("Connected to SQLite database");
  }
});
module.exports = db;
