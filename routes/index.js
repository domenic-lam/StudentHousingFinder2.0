let express = require("express");
let router = express.Router();
let studenthousingDB = require("../db/mySQLiteDB.js");

/* GET home page. */

router.get("/", async function (req, res) {
  let user = req.flash("user");
  req.flash(req.flash("user"));
  // if (user == "") {
  //   res.redirect("/register");
  // }

  console.log("got user " + user);
  const listings = await studenthousingDB.getListings();

  res.render("index", { listings: listings, user: user });
});

router.get("/register", function (req, res) {
  res.render("register");
});
router.get("/owner", function (req, res) {
  res.render("owner");
});
router.get("/student", function (req, res) {
  res.render("student");
});

module.exports = router;
