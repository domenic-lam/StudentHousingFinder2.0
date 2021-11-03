let express = require("express");
let router = express.Router();
let studentHousingDB = require("../db/mySQLiteDB.js");

// save a session for app
let session;

/* GET home page. */
router.get("/", async function (req, res) {
  console.log("Attempting GET /");

  const listings = await studentHousingDB.getListings();
  console.log("got listings");

  session = req.session;

  if (session.userid) {
    // console.log("got session " + session.userid);

    let user = await studentHousingDB.getUserByUsername(session.userid);
    console.log("got user", user);
    let owner = await studentHousingDB.getOwnerByUsername(user.username);
    // console.log("got owner", owner);

    if (owner != undefined) {
      const authorID = owner.authorID;
      // console.log("owner session: ", req.session);
      const ownerListings = await studentHousingDB.getListingByAuthorID(
        authorID
      );
      console.log("render ownerHome ");
      res.render("ownerHome", {
        title: "StudentHousingFinderOwnerHome",
        listings: ownerListings,
        username: user.username,
        authorID: authorID,
      });
    } else {
      const student = await studentHousingDB.getStudentByUsername(
        user.username
      );
      console.log("got student", student);
      // const msgs = await studentHousingDB.getMessages(
      //   ,
      //   owner.username
      // );

      // console.log("hello " + listings.rating);

      // console.log("student session: ", req.session);
      console.log("render studentHome ");
      res.render("studentHome", {
        title: "StudentHousingFinderStudentHome",
        listings: listings,
        username: user.username,
      });
    }
  } else {
    console.log("render index ");
    res.render("index", {
      title: "StudentHousingFinderHome",
      listings: listings,
    });
  }
});

// After user logs in, render page depending on owner/student status
router.post("/user", async function (req, res) {
  console.log("**attempting POST /user");

  const listings = await studentHousingDB.getListings();
  console.log("got listings");
  session = req.session;
  session.userid = req.body.username;

  const user = await studentHousingDB.getUserByUsername(session.userid);
  console.log("got user", user);
  // const username = user.username;
  // const owner = await studentHousingDB.getOwnerByUsername(username);
  // console.log("got owner", owner);
  // const student = await studentHousingDB.getOwnerByUsername(user);

  if (req.body.password == user.password) {
    res.redirect("/");
  }
});

/* GET logout. */
router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

/* GET register. */
router.get("/register", function (req, res) {
  res.render("register");
});

/* GET ownerRegister. */
router.get("/owner", function (req, res) {
  res.render("ownerRegister");
});

/* GET studentRegister. */
router.get("/student", function (req, res) {
  res.render("studentRegister");
});

/* POST create listing. */
router.post("/listings/create", async function (req, res) {
  console.log("**attempting POST listings/create");

  const listing = req.body;
  console.log("create listing", listing);
  const username = await studentHousingDB.getUserByUsername(session.userid);
  // console.log("got user", username);
  const owner = await studentHousingDB.getOwnerByUsername(username);
  // console.log("got owner", owner);
  const authorID = owner.authorID;
  session.authorID = authorID;
  console.log("got authorID", session.authorID);

  try {
    await studentHousingDB.createListing(listing, authorID);
    console.log("Listing created");
  } catch (err) {
    console.log("Listing not created");
  }

  session = req.session;

  res.redirect("/");
});

/* POST create rating. */
router.post("/createRating", async function (req, res) {
  console.log("**attempting POST createRating");
  session = req.session;

  const rating = {
    rating: req.body.rating,
    listingID: req.body.listingID,
    user: session.userid,
  };

  console.log(rating);
  // console.log("create listing", listing);
  // const username = await studentHousingDB.getUserByUsername(session.userid);
  // // console.log("got user", username);
  // const owner = await studentHousingDB.getOwnerByUsername(username);
  // // console.log("got owner", owner);
  // const authorID = owner.authorID;

  try {
    await studentHousingDB.createRating(rating);
    console.log("rating created");
  } catch (err) {
    console.log("rating not created");
  }

  session = req.session;

  res.redirect("listings/" + req.body.listingID);
});

/* GET listing details page. */
router.get("/listings/:listingID", async function (req, res) {
  console.log("**attempting GET listing details");

  session = req.session;

  const listingID = req.params.listingID;

  console.log("Got listing details ", listingID);

  const listing = await studentHousingDB.getListingByID(listingID);
  console.log("Got listing by ID ", listing);

  // const studObj = {
  //   listingID: listingID,
  //   user: session.userid,
  // };
  console.log("listingID, user: ", listingID, session.userid);
  const rating = await studentHousingDB.getRating(listingID, session.userid);
  // console.log(rating);
  console.log("Got listing details", listing);
  const owner = await studentHousingDB.getOwnerByAuthorID(listing.authorID);
  console.log("Got owner" + owner.username);
  const msgs = await studentHousingDB.getMessages(
    session.userid,
    owner.username
  );

  const time = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  res.render("listingDetails", {
    listing,
    user: session.userid,
    rating,
    owner: owner,
    time,
    msgs,
  });
});

/* GET Update listing details. */
router.get("/listings/update/:listingID", async function (req, res) {
  // console.log("**attempting POST listings/update/ID");

  const listingID = req.params.listingID;
  // console.log("Got listing details ", listingID);

  const listing = await studentHousingDB.getListingByID(listingID);
  // console.log("Listing updated");

  session = req.session;
  // console.log("session.userid: ", session);

  res.render("listingEdit", {
    listing,
    username: session.userid,
  });
});

/* GET Update listing details. */
// router.get("/updateRating", async function (req, res) {
//   const rating = req.body;
//   console.log("Got listing details ", rating);

//   const rating = await studentHousingDB.getRating(rating);
//   console.log("Listing updated");

//   session = req.session;

//   res.redirect("/");
// });

/* POST update listing. */
router.post("/listings/update", async function (req, res) {
  console.log("**attempting POST listings/update");

  const listing = req.body;
  // console.log("POST update listing", listing);

  try {
    await studentHousingDB.updateListing(listing);
    console.log("Listing updated");
  } catch (err) {
    console.log("Listing not updated: " + err);
  }

  session = req.session;
  console.log("update listing session", session);

  res.redirect("/");
});

/* POST delete listing. */
router.post("/listings/delete", async function (req, res) {
  console.log("**attempting POST delete listing");

  const listingID = req.body;
  console.log("delete listing", listingID);
  session = req.session;

  try {
    await studentHousingDB.deleteListing(listingID);
    console.log("Listing deleted");
  } catch (err) {
    console.log("Listing not deleted");
  }

  res.redirect("/");
});

/* POST send message. */
router.post("/message/create", async function (req, res) {
  console.log("Got post message/create");

  const msg = req.body;
  console.log("Got create message", msg);
  try {
    await studentHousingDB.createMessage(msg);
    console.log("Message created");
  } catch (err) {
    console.log("Message not created:" + err);
  }

  res.redirect("/listings/" + msg.listingID);
});

/* POST send message. */
router.post("/message/delete", async function (req, res) {
  console.log("Got post message/delete");

  const msg = req.body;
  console.log("Got delete message", msg);
  try {
    await studentHousingDB.deleteMessage(msg.message);
    console.log("Message deleted");
  } catch (err) {
    console.log("Message not deleted:" + err);
  }

  res.redirect("/listings/" + msg.listingID);
});

module.exports = router;
