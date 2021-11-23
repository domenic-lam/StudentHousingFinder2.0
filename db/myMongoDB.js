const { MongoClient, ObjectId } = require("mongodb");

/*
 ***************Student and Owner CRUD OPERATIONS*********************
 */

let StudentHousingDBController = function () {
  let studentHousingDB = {};
  const uri = "mongodb://localhost:27017";
  const DB_NAME = "project2";

  //this function will save a new user to the database
  studentHousingDB.createNewOwner = async (newUser) => {
    {
      let client;
      try {
        client = new MongoClient(uri, {
          useUnifiedTopology: true,
          useNewUrlParser: true,
        });

        await client.connect();
        const db = client.db(DB_NAME);
        const usersCollection = db.collection("users");
        const max = await usersCollection
          .aggregate([
            {
              $group: {
                _id: "$_id",
                count: {
                  $max: "$authorID",
                },
              },
            },
          ])
          .sort({ count: -1 })
          .limit(1)
          .toArray();

        const authorID = max[0].count + 1;

        console.log(authorID);
        const newOwner = {
          username: newUser.username,
          password: newUser.password,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          authorID: authorID,
        };
        const insertResult = await usersCollection.insertOne(newOwner);
        return insertResult.insertedCount;
      } finally {
        client.close();
      }
    }
  };
  studentHousingDB.createNewStudent = async (newUser) => {
    {
      let client;
      try {
        client = new MongoClient(uri, {
          useUnifiedTopology: true,
          useNewUrlParser: true,
        });

        await client.connect();
        const db = client.db(DB_NAME);
        const usersCollection = db.collection("users");
        const insertResult = await usersCollection.insertOne(newUser);
        return insertResult.insertedCount;
      } finally {
        client.close();
      }
    }
  };

  studentHousingDB.getOwnerByAuthorID = async (authorID) => {
    let client;
    try {
      client = new MongoClient(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      await client.connect();
      const db = client.db(DB_NAME);
      const usersCollection = db.collection("users");
      // we will be using the user's email as their username
      const queryResult = await usersCollection
        .findOne({
          authorID: authorID,
        })
        .toArray();
      console.log(queryResult);
      return queryResult;
    } finally {
      // we have to close the database connection otherwise we will overload the mongodb service.
      await client.close();
    }
  };

  studentHousingDB.getUserByUsername = async (query) => {
    let client;
    try {
      client = new MongoClient(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      await client.connect();
      const db = client.db(DB_NAME);
      const usersCollection = db.collection("users");
      // we will be using the user's email as their username
      const queryResult = await usersCollection.findOne({
        username: query,
      });
      console.log(queryResult);
      return queryResult;
    } finally {
      // we have to close the database connection otherwise we will overload the mongodb service.
      await client.close();
    }
  };

  // this function will query the database for a user object by using an username string

  // this function will query the database for a user object by using an username string and password
  studentHousingDB.getUserCred = async (user) => {
    let client;
    try {
      client = new MongoClient(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      await client.connect();
      const db = client.db(DB_NAME);
      const usersCollection = db.collection("users");
      // we will be using the user's email as their username
      const queryResult = await usersCollection
        .findOne({
          username: user.username,
          password: user.password,
        })
        .toArray();
      return queryResult;
    } finally {
      // we have to close the database connection otherwise we will overload the mongodb service.
      await client.close();
    }
  };

  //  ***************Listing CRUD OPERATIONS*********************
  //  */
  // // create new Listing
  studentHousingDB.createListing = async (newListing, authorID) => {
    {
      let client;
      try {
        client = new MongoClient(uri, {
          useUnifiedTopology: true,
          useNewUrlParser: true,
        });

        await client.connect();
        const db = client.db(DB_NAME);
        const listingsCollection = db.collection("listings");

        const newlisting = {
          location: newListing.location,
          openingDate: newListing.openingDate,
          size: newListing.size,
          unitType: newListing.unitType,
          offer: newListing.offer,
          description: newListing.description,
          leaseInMonths: newListing.leaseInMonths,
          available: newListing.available,
          authorID: authorID,
        };
        const insertResult = await listingsCollection.insertOne(newlisting);
        return insertResult.insertedCount;
      } finally {
        client.close();
      }
    }
  };

  // get all Listings , may implement pagination later
  studentHousingDB.getListings = async () => {
    let client;
    try {
      client = new MongoClient(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      await client.connect();
      const db = client.db(DB_NAME);
      const listingsCollection = db.collection("listings");
      // we will be using the user's email as their username
      const queryResult = await listingsCollection
        .aggregate([
          {
            $unwind: {
              path: "$rating",
            },
          },

          {
            $group: {
              _id: "$_id",
              location: {
                $last: "$location",
              },
              openingDate: {
                $last: "$openingDate",
              },
              size: {
                $last: "$size",
              },
              unitType: {
                $last: "$unitType",
              },
              offer: {
                $last: "$offer",
              },
              description: {
                $last: "$description",
              },
              leaseInMonths: {
                $last: "$leaseInMonths",
              },
              available: {
                $last: "$available",
              },
              authorID: {
                $last: "$authorID",
              },
              avgRating: {
                $avg: "$rating.rating",
              },
            },
          },
        ])
        .toArray();
      return queryResult;
    } finally {
      // we have to close the database connection otherwise we will overload the mongodb service.
      await client.close();
    }
  };

  studentHousingDB.getRatingByIDS = async (listingID, user) => {
    let client;
    try {
      client = new MongoClient(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      await client.connect();
      const db = client.db(DB_NAME);
      const listingsCollection = db.collection("listings");
      // we will be using the user's email as their username
      const queryResult = await listingsCollection
        .aggregate([
          {
            $unwind: {
              path: "$rating",
            },
          },

          {
            $group: {
              _id: listingID,
              raterID: {
                $last: user,
              },
              rating: { $last: "$rating.rating" },
            },
          },
        ])
        .toArray();
      return queryResult;
    } finally {
      // we have to close the database connection otherwise we will overload the mongodb service.
      await client.close();
    }
  };

  // // get all Listings , may implement pagination later
  // studentHousingDB.searchListings = async (searches) => {
  //   let db, stmt;
  //   db = await connect();
  //   if (searches != undefined) {
  //     try {
  //       stmt = await db.prepare(
  //         `SELECT Round(Avg(rating),1) AS avgRating, Listing.*
  //         FROM Rating JOIN Listing ON Listing.listingID = Rating.listingID
  //         WHERE (Listing.description LIKE :description AND Listing.leaseInMonths = :leaseInMonths
  //         AND Listing.offer <= offer AND Listing.openingDate = :openingDate AND Listing.size = :size AND Listing.unitType = :unitType)
  //         GROUP BY Listing.listingID UNION SELECT 0 AS avgRating, Listing.* FROM Listing
  //         WHERE Listing.listingID NOT IN (SELECT Rating.listingID FROM Rating) ORDER BY Listing.listingID DESC LIMIT 20;
  //         `
  //       );
  //       stmt.bind({
  //         ":location": searches.location,
  //         ":openingDate": searches.openingDate,
  //         ":size": searches.size,
  //         ":unitType": searches.unitType,
  //         ":offer": searches.offer,
  //         ":description": searches.description,
  //         ":leaseInMonths": searches.leaseInMonths,
  //       });
  //       return await stmt.all();
  //     } catch (err) {
  //       console.log(err);
  //     } finally {
  //       stmt.finalize();
  //       db.close();
  //     }
  //   } else {
  //     try {
  //       return await db.all(
  //         "SELECT Round(Avg(rating),1) AS avgRating,Listing.* FROM Rating JOIN Listing ON Listing.listingID = Rating.listingID GROUP BY Listing.listingID UNION SELECT 0 AS avgRating, Listing.* FROM Listing WHERE Listing.listingID NOT IN (SELECT Rating.listingID FROM Rating)ORDER BY Listing.listingID DESC LIMIT 20;"
  //       );
  //     } finally {
  //       db.close();
  //     }
  //   }
  // };

  // // read selected Listing info
  studentHousingDB.getListingByID = async (listingID) => {
    let client;
    try {
      client = new MongoClient(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      await client.connect();
      const db = client.db(DB_NAME);
      const listingsCollection = db.collection("listings");
      // we will be using the user's email as their username
      const queryResult = await listingsCollection
        .find({ _id: new ObjectId(listingID) })
        .toArray();

      return queryResult;
    } finally {
      // we have to close the database connection otherwise we will overload the mongodb service.
      await client.close();
    }
  };

  // // read selected Listing info
  studentHousingDB.getListingByAuthorID = async (authorID) => {
    let client;
    try {
      client = new MongoClient(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      await client.connect();
      const db = client.db(DB_NAME);
      const listingsCollection = db.collection("listings");
      // we will be using the user's email as their username
      const queryResult = await listingsCollection
        .find({
          authorID: authorID,
        })
        .toArray();
      return queryResult;
    } finally {
      // we have to close the database connection otherwise we will overload the mongodb service.
      await client.close();
    }
  };

  // studentHousingDB.createRating = async (newRating) => {
  //   let db, stmt;
  //   try {
  //     db = await connect();

  //     stmt = await db.prepare(`INSERT INTO
  //       Rating(raterID, rating, listingID)
  //       VALUES (:raterID, :rating, :listingID)
  //     `);

  //     stmt.bind({
  //       ":raterID": newRating.user,
  //       ":rating": newRating.rating,
  //       ":listingID": newRating.listingID,
  //     });

  //     return await stmt.run();
  //   } finally {
  //     stmt.finalize();
  //     db.close();
  //   }
  // };

  // // update Listing info
  // studentHousingDB.updateRating = async (ratingToUpdate) => {
  //   let db, stmt;
  //   try {
  //     db = await connect();

  //     stmt = await db.prepare(`UPDATE Rating
  //     SET rating = :rating
  //     WHERE listingID = :theIDToUpdate AND raterID = :raterID
  //   `);

  //     stmt.bind({
  //       ":raterID": ratingToUpdate.raterID,
  //       ":rating": ratingToUpdate.rating,
  //       ":theIDToUpdate": ratingToUpdate.listingID,
  //     });

  //     return await stmt.run();
  //   } finally {
  //     stmt.finalize();
  //     db.close();
  //   }
  // };

  // // update Listing info
  studentHousingDB.updateListing = async (listingToUpdate) => {
    let client;
    try {
      client = new MongoClient(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      await client.connect();
      const db = client.db(DB_NAME);
      const contactsCollection = db.collection("listings");
      const updateResult = await contactsCollection.updateOne(
        {
          _id: new ObjectId(listingToUpdate.listingID),
        },
        {
          $set: {
            location: listingToUpdate.location,
            openingDate: listingToUpdate.openingDate,
            size: listingToUpdate.size,
            unitType: listingToUpdate.unitType,
            offer: listingToUpdate.offer,
            description: listingToUpdate.description,
            leaseInMonths: listingToUpdate.leaseInMonths,
            available: listingToUpdate.available,
          },
        }
      );
      return updateResult;
    } finally {
      await client.close();
    }
  };

  // // delete Listing
  studentHousingDB.deleteListing = async (listingToDelete) => {
    let client;
    try {
      client = new MongoClient(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      await client.connect();
      const db = client.db(DB_NAME);
      const contactsCollection = db.collection("listings");
      const deleteResult = await contactsCollection.deleteOne({
        _id: new ObjectId(listingToDelete),
      });
      return deleteResult;
    } finally {
      client.close();
    }
  };

  // /*
  //  ***************MESSAGE CRUD OPERATIONS*********************
  //  */

  studentHousingDB.createMessage = async (newMessage) => {
    {
      let client;
      try {
        client = new MongoClient(uri, {
          useUnifiedTopology: true,
          useNewUrlParser: true,
        });

        await client.connect();
        const db = client.db(DB_NAME);
        const messageCollection = db.collection("message");
        const insertResult = await messageCollection.insertOne(newMessage);
        return insertResult.insertedCount;
      } finally {
        client.close();
      }
    }
  };

  // studentHousingDB.getMessages = async (sender, receiver) => {
  //   let db, stmt;
  //   try {
  //     db = await connect();

  //     stmt = await db.prepare(`SELECT *
  //       FROM Message
  //       WHERE (sender IS :sender AND receiver IS :receiver) OR (sender IS :receiver AND receiver IS :sender)
  //       ORDER BY time DESC
  //     `);

  //     stmt.bind({
  //       ":sender": sender,
  //       ":receiver": receiver,
  //     });

  //     return await stmt.all();
  //   } finally {
  //     stmt.finalize();
  //     db.close();
  //   }
  // };

  studentHousingDB.getAllMessages = async (owner) => {
    let db, stmt;
    try {
      db = await connect();

      stmt = await db.prepare(`SELECT *
        FROM Message
        WHERE sender IS :sender OR receiver IS :sender
        ORDER BY time DESC
      `);

      stmt.bind({
        ":sender": owner,
      });

      // console.log(await stmt.all());
      return await stmt.all();
    } finally {
      stmt.finalize();
      db.close();
    }
  };

  // studentHousingDB.getMessageByID = async (messageID) => {
  //   let db, stmt;
  //   try {
  //     db = await connect();

  //     stmt = await db.prepare(`SELECT *
  //       FROM Message
  //       WHERE messageID = :messageID
  //     `);

  //     stmt.bind({
  //       ":messageID": messageID,
  //     });

  //     return await stmt.get();
  //   } finally {
  //     stmt.finalize();
  //     db.close();
  //   }
  // };

  // // delete Message
  // studentHousingDB.deleteMessage = async (messageToDelete) => {
  //   let db, stmt;
  //   try {
  //     db = await connect();

  //     stmt = await db.prepare(`DELETE FROM
  //     Message
  //     WHERE messageID = :messageToDelete
  //   `);

  //     stmt.bind({
  //       ":messageToDelete": messageToDelete,
  //     });

  //     return await stmt.run();
  //   } finally {
  //     stmt.finalize();
  //     db.close();
  //   }
  // };

  return studentHousingDB;
};

module.exports = StudentHousingDBController();
