const router = require("express").Router();
const { User } = require("../models/");
const withAuth = require("../utils/auth");
const generateHash = require("../utils/generateHash");

// router.get("/", async (req, res) => {
//   try {
//     res.render("main");
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

router.get("/login", (req, res) => {
  if (req.session.loggedIn) {
    res.redirect("/");
    return;
  }
  res.render("login");
});

router.get("/signup", (req, res) => {
  if (req.session.loggedIn) {
    res.redirect("/");
    return;
  }
  res.render("signup");
});

router.get("/highscore", async (req, res) => {
  try {
    res.render("highscores");
  } catch (err) {
    res.redirect("/login");
  }
});

// router.get("/play", withAuth, async (req, res) => {
//   try {
//     window.location.replace("/" + generateHash(6));
//   } catch (err) {
//     res.redirect("/login");
//   }
// });

// router.get("/play/:room([A-Za-z0-9]{6})", withAuth, (req, res) => {
//   try {
//     res.render("index");
//   } catch (err) {
//     res.redirect("/login");
//   }
// });

// test routes for connection, room id is generated from random hash
router.get("/", async (req, res) => {
  try {
    res.redirect("/" + generateHash(6));
  } catch (err) {
    console.log(err);
    // res.redirect("/login");
  }
});

router.get("/:room([A-Za-z0-9]{6})", (req, res) => {
  try {
    res.render("main");
  } catch (err) {
    console.log(err);
    // res.redirect("/login");
  }
});

module.exports = router;
