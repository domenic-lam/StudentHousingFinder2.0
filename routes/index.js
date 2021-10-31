let express = require("express");
let router = express.Router();

const listingDB = require("../db/mySqliteDB.js");

/* GET home page. */
router.get("/", async function (req, res) {
  console.log("Got request for /");

  const listings = await listingDB.getListings();
  console.log("got listings", listings);

  res.render("index", {
    title: "StudentHousingFinderHome",
    listings: listings,
  });
});

/* GET user registration */
router.get("/register", function (req, res) {
  res.render("register", { title: "Register" });
});

/* POST create listing. */
router.post("/listings/create", async function (req, res) {
  console.log("Got post listings/create");

  const listing = req.body;
  console.log("Got create listing", listing);

  await listingDB.createListing(listing);
  console.log("Listing created");

  res.redirect("/");
});

/* GET listing details. */
router.get("/listings/:listingID", async function (req, res) {
  console.log("Got listing details");

  const listingID = req.params.listingID;

  console.log("Got listing details ", listingID);

  const listing = await listingDB.getListingByID(listingID);

  console.log("Listing updated");

  res.render("listingDetails", { listing: listing });
});

module.exports = router;
