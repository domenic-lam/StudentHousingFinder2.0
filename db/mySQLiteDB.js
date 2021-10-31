const sqlite3 = require("sqlite3");
const { open } = require("sqlite");

sqlite3.verbose();

// Connect to housing.db with sqlite3
async function connect() {
  return open({
    filename: "./db/housing.db",
    driver: sqlite3.Database,
  });
}

const StudentHousingDBController = function () {
  const studenthousingDB = {};

  /*
   ***************USER CRUD OPERATIONS*********************
   */

  //this function will save a new user to the database

  studenthousingDB.saveNewUser = async function (newUser) {
    const db = await connect();

    const stmt = await db.prepare(`INSERT INTO
      User(username, password)
      VALUES (:username, :password)
    `);
    stmt.bind({
      ":username": newUser.username,
      ":password": newUser.password,
    });
    await stmt.run();
  };

  console.log("insert successful");

  return studenthousingDB;
};

async function getListings() {
  const db = await connect();

  return await db.all("SELECT * FROM Listing ORDER BY listingID DESC LIMIT 20");
}

async function createListing(newListing) {
  const db = await connect();

  const stmt = await db.prepare(`INSERT INTO
    Listing(location, openingDate, size, unitType, offer, description, leaseInMonths, available, authorID)
    VALUES (:location, :openingDate, :size, :unitType, :offer, :description, :leaseInMonths, :available, :authorID)
  `);

  stmt.bind({
    ":location": newListing.location,
    ":openingDate": newListing.openingDate,
    ":size": newListing.size,
    ":unitType": newListing.unitType,
    ":offer": newListing.offer,
    ":description": newListing.description,
    ":leaseInMonths": newListing.leaseInMonths,
    ":available": newListing.available,
    ":authorID": newListing.authorID,
  });

  return await stmt.run();
}

module.exports = StudentHousingDBController();
module.exports.createListing = createListing;
module.exports.getListings = getListings;
