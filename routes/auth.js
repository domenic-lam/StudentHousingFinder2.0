let express = require("express");
let router = express.Router();
let studenthousingDB = require("../db/mySQLiteDB.js");

router.post("/registerOwner", async (req, res) => {
  //this route will handle registering a user to the database

  //we will first check if the username already exists
  let duplicateUsername = await studenthousingDB.getUserByUsername(
    req.body.username
  );
  console.log(duplicateUsername);
  if (duplicateUsername != undefined) {
    //res.send({ registered: false });
    res.redirect("/register");
  } else {
    let newUserObj = {
      username: req.body.username,
      password: req.body.password,
    };
    console.log(newUserObj);
    const registered = await studenthousingDB.saveNewUser(newUserObj);
    let newOwnerObj = {
      username: req.body.username,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
    };
    const owner = await studenthousingDB.saveNewOwner(newOwnerObj);

    //if the register was successful, we send a true resposne
    if (registered === 1 && owner === 1) {
      //res.send({ registered: true });
      res.redirect("/");
    } else {
      // send a false response to the frontend if something went wrong with the registration
      //res.send({ registered: false });
      res.redirect("/register");
    }
  }
});

router.post("/registerStudent", async (req, res) => {
  //this route will handle registering a user to the database

  //we will first check if the username already exists
  let duplicateUsername = await studenthousingDB.getUserByUsername(
    req.body.username
  );
  console.log(duplicateUsername);
  if (duplicateUsername != undefined) {
    //res.send({ registered: false });
    res.redirect("/register");
  } else {
    let newUserObj = {
      username: req.body.username,
      password: req.body.password,
    };
    console.log(newUserObj);
    const registered = await studenthousingDB.saveNewUser(newUserObj);

    let newStudentObj = {
      username: req.body.username,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      schoolID: req.body.schoolID,
      semester: req.body.semester,
      year: req.body.year,
      budget: req.body.budget,
    };

    console.log(newStudentObj);
    const student = await studenthousingDB.saveNewStudent(newStudentObj);
    console.log(student);

    //if the register was successful, we send a true resposne
    if (registered === 1 && student === 1) {
      //res.send({ registered: true });
      res.redirect("/");
    } else {
      // send a false response to the frontend if something went wrong with the registration
      //res.send({ registered: false });
      res.redirect("/register");
    }
  }
});
router.post("/loginUser", async (req, res) => {
  const userObj = {
    username: req.body.username,
    password: req.body.password,
  };

  try {
    const login = await studenthousingDB.getUserCred(userObj);
    if (login != undefined) {
      req.session.user = req.body.username;
      //res.send({ login: "ok", user: req.session.user });
      const user = req.session.user;
      console.log(user);
      console.log(req.flash("user", user));
      res.redirect("/");
      //req.flash("user", user);
    } else {
      //res.send({ login: "wrong username or password" });
    }
  } catch (e) {
    console.log("Error", e);
    res.status(400).send({ err: e });
  }
});

router.post("/logoutUser", async (req, res) => {
  const username = req.body;

  try {
    const login = await studenthousingDB.getUserCred(username);
    if (login === false) {
      req.session.user = "";
      const user = req.session.user;
      req.flash("user", user);
      //res.send({ logout: "ok", user: req.session.user });
    } else {
      //res.send({ logout: "error" });
    }
  } catch (e) {
    console.log("Error", e);
    res.status(400).send({ err: e });
  }
});

module.exports = router;
