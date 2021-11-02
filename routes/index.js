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
    console.log("got session " + session.userid);

    const username = await studentHousingDB.getUserByUsername(session.userid);
    console.log("got user", username);
    const owner = await studentHousingDB.getOwnerByUsername(username);
    console.log("got owner", owner);

    if (owner != undefined) {
      const authorID = owner.authorID;
      console.log("owner session: ", req.session);
      // res.redirect("/ownerHome");
      res.render("ownerHome", {
        title: "StudentHousingFinderOwnerHome",
        listings: listings,
        username: username,
        authorID: authorID,
      });
    } else {
      console.log(listings);
      const student = await studentHousingDB.getStudentByUsername(username);
      console.log("got student", student);
      //console.log("hello " + listings.rating);
      res.render("studentHome", {
        title: "StudentHousingFinderStudentHome",
        listings: listings,
        username: username,
      });
      console.log("student session: ", req.session);
    }
  } else {
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

  const username = await studentHousingDB.getUserByUsername(session.userid);
  console.log("got user", username);
  const owner = await studentHousingDB.getOwnerByUsername(username);
  console.log("got owner", owner);
  // const student = await studentHousingDB.getOwnerByUsername(user);

  if (req.body.password == username.password) {
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

/* GET studentHome. */
router.get("/studentHome", function (req, res) {
  res.render("studentHome");
});

/* POST create rating. */
router.post("/listings/create", async function (req, res) {
  console.log("**attempting POST listings/create");

  const listing = req.body;
  // console.log("create listing", listing);
  // const username = await studentHousingDB.getUserByUsername(session.userid);
  // // console.log("got user", username);
  // const owner = await studentHousingDB.getOwnerByUsername(username);
  // // console.log("got owner", owner);
  // const authorID = owner.authorID;

  try {
    await studentHousingDB.createListing(listing);
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

/* GET listing details. */
router.get("/listings/:listingID", async function (req, res) {
  console.log("**attempting GET listing details");

  session = req.session;

  const listingID = req.params.listingID;

  console.log("Got listing details ", listingID);

  const listing = await studentHousingDB.getListingByID(listingID);

  const studObj = {
    listingID: listingID,
    user: session.userid,
  };
  console.log(studObj);
  const rating = await studentHousingDB.getRating(studObj);
  console.log(rating);
  console.log("Got listing details");

  res.render("listingDetails", {
    listing: listing,
    user: session.userid,
    rating: rating,
  });
});

/* GET Update listing details. */
router.get("/listings/update/:listingID", async function (req, res) {
  console.log("**attempting POST listings/update/ID");

  const listingID = req.params.listingID;
  console.log("Got listing details ", listingID);

  const listing = await studentHousingDB.getListingByID(listingID);
  console.log("Listing updated");

  session = req.session;

  res.render("listingEdit", { listing: listing });
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
  try {
    await studentHousingDB.updateListing(listing);
    console.log("Listing updated");
  } catch (err) {
    console.log("Listing not updated");
  }

  session = req.session;
  console.log("update listing session", session);

  const listing = req.body;
  // console.log("POST update listing", listing);

  res.redirect("/");
});

/* POST delete listing. */
router.post("/listings/delete", async function (req, res) {
  console.log("**attempting POST delete listing");

  const listing = req.body;
  console.log("delete listing", listing);
  session = req.session;

  try {
    await studentHousingDB.deleteListing(listing);
    console.log("Listing deleted");
  } catch (err) {
    console.log("Listing not deleted");
  }

  res.redirect("/");
});

/* POST send message. */
router.post("/message/send", async function (req, res) {
  console.log("Got post message/send");

  const msg = req.body;
  console.log("Got create message", msg);

  await studentHousingDB.createMessage(msg);
  console.log("Message created");

  res.redirect("/");
});

module.exports = router;
