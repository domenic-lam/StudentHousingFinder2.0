const sqlite3 = require("sqlite3");
const { open } = require("sqlite");

sqlite3.verbose();

async function connect() {
  return open({
    filename: "./db/studenthousing.db",
    driver: sqlite3.Database,
  });
}
