const router = require("express").Router();
const { User } = require("../models/");

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

// high score page for only when user is logged in.
router.get("/highscore", withAuth, async (req, res) => {
  try {
    res.render("highscores");
  } catch (err) {
    res.redirect("login");
  }
});

module.exports = router;
