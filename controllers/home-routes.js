const router = require("express").Router();
const { User } = require("../models/");
const withAuth = require("../utils/auth");
const generateHash = require("../utils/generateHash");

router.get("/", async (req, res) => {
  try {
    res.render("homepage", {
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/login", (req, res) => {
  if (req.session.logged_in) {
    res.redirect("/");
    return;
  }
  res.render("login");
});

router.get("/signup", (req, res) => {
  if (req.session.logged_in) {
    res.redirect("/");
    return;
  }
  res.render("signup");
});

// test routes for connection, room id is generated from random hash
router.get("/play", withAuth, async (req, res) => {
  try {
    res.redirect("/" + generateHash(8));
  } catch (err) {
    console.log(err);
  }
});

router.get("/:room([A-Za-z0-9]{8})", withAuth, async (req, res) => {
  try {
    res.render("game", {
      user_id: req.session.user_id,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    // alert not working?
    // alert("You must login first to play!")
    res.redirect("/login");
  }
});

router.get("/leaderboard", withAuth, async (req, res) => {
  try {
    const dbUserData = await User.findAll({
      order: [["win_count", "DESC"]],
    });

    const users = dbUserData.map((user) => user.get({ plain: true }));

    res.render("leaderboard", {
      users,
      user_id: req.session.user_id,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.get("/profile", withAuth, async (req, res) => {
  try {
    res.render("avatar", {
      user_id: req.session.user_id,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.redirect("login");
  }
});

module.exports = router;
