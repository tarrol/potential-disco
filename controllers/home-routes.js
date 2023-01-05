const router = require("express").Router();
const { User } = require("../models/");
const withAuth = require("../utils/auth");
const { generateRoom } = require("../scripts/gen_room.js");

router.get("/", async (req, res) => {
  try {
    res.render("main");
  } catch (err) {
    res.status(500).json(err);
  }
});

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

router.get("/play", withAuth, async (req, res) => {
  try {
    window.location.replace("/" + generateRoom(6));
  } catch (err) {
    res.redirect("/login");
  }
});

router.get("/play/:room([A-Za-z0-9]{6})", withAuth, (req, res) => {
  try {
    res.render("game");
  } catch (err) {
    res.redirect("/login");
  }
});

module.exports = router;
