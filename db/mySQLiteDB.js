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

    try {
      await stmt.run();
      console.log("sign up successful");
      return 1;
    } catch (err) {
      console.log("sign up unsuccessful");
    }

    return 0;
  };

  // this function will query the database for a user object by using an username string
  studenthousingDB.getUserByUsername = async (query) => {
    const db = await connect();

    const stmt = await db.prepare(`SELECT *
    FROM USER
    WHERE
      username = :username
  `);

    stmt.bind({
      ":username": query,
    });

    return await stmt.get();
  };

  // this function will query the database for a user object by using an username string and password
  studenthousingDB.getUserCred = async (user) => {
    const db = await connect();

    console.log(user);
    const stmt = await db.prepare(`SELECT *
    FROM USER
    WHERE
      username = :username 
    and
      password = :password
      
  `);

    stmt.bind({
      ":username": user.username,
      ":password": user.password,
    });

    return await stmt.get();
  };

  /*
   ***************Student and Owner CRUD OPERATIONS*********************
   */

  studenthousingDB.saveNewStudent = async function (newStudent) {
    const db = await connect();

    const stmt = await db.prepare(`INSERT INTO
      Student(username, firstName, lastName, schoolID, semester, year, budget)
      VALUES (:username, :firstName, :lastName, :schoolID, :semester, :year, :budget)
    `);
    stmt.bind({
      ":username": newStudent.username,
      ":firstName": newStudent.firstName,
      ":lastName": newStudent.lastName,
      ":schoolID": newStudent.schoolID,
      ":semester": newStudent.semester,
      ":year": newStudent.year,
      ":budget": newStudent.budget,
    });

    try {
      await stmt.run();
      console.log("sign up successful");
      return 1;
    } catch (err) {
      console.log("sign up unsuccessful");
    }

    return 0;
  };

  studenthousingDB.saveNewOwner = async function (newOwner) {
    const db = await connect();

    const stmt = await db.prepare(`INSERT INTO
      Owner(username, firstName, lastName)
      VALUES (:username, :firstName, :lastName)
    `);
    stmt.bind({
      ":username": newOwner.username,
      ":firstName": newOwner.firstName,
      ":lastName": newOwner.lastName,
    });

    try {
      await stmt.run();
      console.log("sign up successful");
      return 1;
    } catch (err) {
      console.log("sign up unsuccessful");
    }

    return 0;
  };
  /*
   ***************Listing CRUD OPERATIONS*********************
   */

  studenthousingDB.getListings = async () => {
    const db = await connect();

    return await db.all(
      "SELECT * FROM Listing ORDER BY listingId DESC LIMIT 20"
    );
  };

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

async function getListingByID(listingID) {
  const db = await connect();

  const stmt = await db.prepare(`SELECT *
    FROM Listing
    WHERE
      listingID = :listingID
  `);

  stmt.bind({
    ":listingID": listingID,
  });

  return await stmt.get();
}

module.exports = StudentHousingDBController();
module.exports.createListing = createListing;
module.exports.getListings = getListings;
module.exports.getListingByID = getListingByID;
