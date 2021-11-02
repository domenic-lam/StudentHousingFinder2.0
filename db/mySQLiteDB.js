let sqlite3 = require("sqlite3");
let { open } = require("sqlite");

sqlite3.verbose();

// Connect to housing.db with sqlite3
async function connect() {
  return open({
    filename: "./db/housing.db",
    driver: sqlite3.Database,
  });
}

/*
 ***************USER CRUD OPERATIONS*********************
 */

let StudentHousingDBController = function () {
  let studentHousingDB = {};

  //this function will save a new user to the database
  studentHousingDB.createNewUser = async newUser => {
    let db, stmt;
    try {
      db = await connect();

      stmt = await db.prepare(`INSERT INTO
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
      } catch (err) {
        console.log("sign up unsuccessful");
      }
    } finally {
      stmt.finalize();
      db.close();
    }
  };

  // this function will query the database for a user object by using an username string
  studentHousingDB.getUserByUsername = async query => {
    let db, stmt;
    try {
      db = await connect();

      stmt = await db.prepare(`SELECT *
    FROM USER
    WHERE
      username = :username
    `);

      stmt.bind({
        ":username": query,
      });

      return await stmt.get();
    } finally {
      stmt.finalize();
      db.close();
    }
  };

  // this function will query the database for a user object by using an username string and password
  studentHousingDB.getUserCred = async user => {
    let db, stmt;
    try {
      db = await connect();

      console.log(user);
      stmt = await db.prepare(`SELECT *
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
    } finally {
      stmt.finalize();
      db.close();
    }
  };

  /*
   ***************Student and Owner CRUD OPERATIONS*********************
   */

  studentHousingDB.createNewStudent = async function (newStudent) {
    let db, stmt;
    try {
      db = await connect();

      stmt = await db.prepare(`INSERT INTO
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
      } catch (err) {
        console.log("sign up unsuccessful");
      }
    } finally {
      stmt.finalize();
      db.close();
    }
  };

  studentHousingDB.createNewOwner = async function (newOwner) {
    let db, stmt;
    try {
      db = await connect();

      stmt = await db.prepare(`INSERT INTO
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
      } catch (err) {
        console.log("sign up unsuccessful");
      }
    } finally {
      stmt.finalize();
      db.close();
    }
  };

  studentHousingDB.getOwnerByUsername = async username => {
    let db, stmt;
    try {
      db = await connect();

      stmt = await db.prepare(`SELECT *
      FROM Owner
      WHERE
        username = :username
      `);
      stmt.bind({
        ":username": username.username,
      });

      return await stmt.get();
    } finally {
      stmt.finalize();
      db.close();
    }
  };

  studentHousingDB.getOwnerByAuthorID = async authorID => {
    let db, stmt;
    try {
      db = await connect();

      stmt = await db.prepare(`SELECT *
      FROM Owner
      WHERE
        authorID = :authorID
      `);

      stmt.bind({
        ":authorID": authorID.authorID,
      });

      return await stmt.get();
    } finally {
      stmt.finalize();
      db.close();
    }
  };

  studentHousingDB.getStudentByUsername = async studentID => {
    let db, stmt;
    try {
      db = await connect();

      stmt = await db.prepare(`SELECT *
      FROM Student
      WHERE
        username = :username
      `);
      stmt.bind({
        ":username": studentID.username,
      });

      return await stmt.get();
    } finally {
      stmt.finalize();
      db.close();
    }
  };

  /*
   ***************Listing CRUD OPERATIONS*********************
   */
  // create new Listing
  studentHousingDB.createListing = async newListing => {
    let db, stmt;
    try {
      db = await connect();

      stmt = await db.prepare(`INSERT INTO
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
        ":authorID": 1,
      });

      return await stmt.run();
    } finally {
      stmt.finalize();
      db.close();
    }
  };

  // get all Listings , may implement pagination later
  studentHousingDB.getListings = async () => {
    let db;
    try {
      db = await connect();

      return await db.all(
        "SELECT Avg(Rating.rating) AS avgRating, Rating.rating, Rating.raterID, Listing.location,Listing.openingDate, Listing.size, Listing.unitType, Listing.offer, Listing.description, Listing.leaseInMonths, Listing.listingID, Listing.available FROM Listing JOIN Rating ON Rating.listingId = Listing.listingId GROUP BY Listing.listingId ORDER BY Listing.listingId DESC LIMIT 20"
      );
    } finally {
      db.close();
    }
  };

  // // get all Listings , may implement pagination later
  studentHousingDB.getRating = async student => {
    let db, stmt;
    try {
      db = await connect();

      stmt = await db.prepare(
        "SELECT rating FROM Rating WHERE raterID = raterID AND listingID = listingID"
      );

      stmt.bind({
        ":listingID": student.listingID,
        ":raterID": student.user,
      });

      return await stmt.run();
    } finally {
      stmt.finalize();
      db.close();
    }
  };

  // // read selected Listing info
  studentHousingDB.getListingByID = async listingID => {
    let db, stmt;
    try {
      db = await connect();

      stmt = await db.prepare(`SELECT *
      FROM Listing
      WHERE
        listingID = :listingID
    `);

      stmt.bind({
        ":listingID": listingID,
      });

      return await stmt.get();
    } finally {
      stmt.finalize();
      db.close();
    }
  };

  studentHousingDB.createRating = async newRating => {
    let db, stmt;
    try {
      db = await connect();

      stmt = await db.prepare(`INSERT INTO
        Rating(raterID, rating, listingID)
        VALUES (:raterID, :rating, :listingID)
      `);

      stmt.bind({
        ":raterID": newRating.user,
        ":rating": newRating.rating,
        ":listingID": newRating.listingID,
      });

      return await stmt.run();
    } finally {
      stmt.finalize();
      db.close();
    }
  };

  // update Rating info
  studentHousingDB.updateListing = async listingToUpdate => {
    let db, stmt;
    try {
      db = await connect();

      stmt = await db.prepare(`UPDATE Listing
      SET location = :location, openingDate = :openingDate, size = :size, unitType = :unitType, offer = :offer, description = :description, leaseInMonths = :leaseInMonths, available = :available
      WHERE listingID = :theIDToUpdate
    `);

      stmt.bind({
        ":theIDToUpdate": listingToUpdate.listingID,
        ":location": listingToUpdate.location,
        ":openingDate": listingToUpdate.openingDate,
        ":size": listingToUpdate.size,
        ":unitType": listingToUpdate.unitType,
        ":offer": listingToUpdate.offer,
        ":description": listingToUpdate.description,
        ":leaseInMonths": listingToUpdate.leaseInMonths,
        ":available": listingToUpdate.available,
      });

      return await stmt.run();
    } finally {
      stmt.finalize();
      db.close();
    }
  };

  // update Listing info
  studentHousingDB.updateListing = async listingToUpdate => {
    let db, stmt;
    try {
      db = await connect();

      stmt = await db.prepare(`UPDATE Listing
      SET location = :location, openingDate = :openingDate, size = :size, unitType = :unitType, offer = :offer, description = :description, leaseInMonths = :leaseInMonths, available = :available
      WHERE listingID = :theIDToUpdate
    `);

      stmt.bind({
        ":location": listingToUpdate.location,
        ":openingDate": listingToUpdate.openingDate,
        ":size": listingToUpdate.size,
        ":unitType": listingToUpdate.unitType,
        ":offer": listingToUpdate.offer,
        ":description": listingToUpdate.description,
        ":leaseInMonths": listingToUpdate.leaseInMonths,
        ":available": listingToUpdate.available,
        ":theIDToUpdate": listingToUpdate.listingID,
      });

      return await stmt.run();
    } finally {
      stmt.finalize();
      db.close();
    }
  };

  // delete Listing
  studentHousingDB.deleteListing = async listingToDelete => {
    let db, stmt;
    try {
      db = await connect();

      stmt = await db.prepare(`DELETE FROM
      Listing
      WHERE listingID = :theIDToDelete
    `);

      stmt.bind({
        ":theIDToDelete": listingToDelete.listingID,
      });

      return await stmt.run();
    } finally {
      stmt.finalize();
      db.close();
    }
  };

  /*
   ***************MESSAGE CRUD OPERATIONS*********************
   */

  async function createMessage(newMessage) {
    let db, stmt;
    try {
      db = await connect();

      stmt = await db.prepare(`INSERT INTO
        Message (messageID, sender, receiver, time, message)
        VALUES (:messageID, :sender, :receiver, :time, :message)
      `);

      stmt.bind({
        ":messageID": newMessage.messageID,
        ":sender": newMessage.sender,
        ":receiver": newMessage.receiver,
        ":time": newMessage.time,
        ":message": newMessage.message,
      });

      return await stmt.run();
    } finally {
      stmt.finalize();
      db.close();
    }
  }

  return studentHousingDB;
};

module.exports = StudentHousingDBController();
