const router = require("express").Router();
const { User } = require("../../models");
const withAuth = require("../../utils/auth");

//const findAvatar = require("../../scripts/avatar");
router.get('/me', (req, res) => {
  // Find the logged in user based on the userId in the session
  User.findByPk(req.session.user_id)
    .then(user => {
      // Send the user data as a response
      res.json(user);
    })
    .catch(error => {
      // If an error occurs, send a 500 status code with the error message
      res.status(500).send(error.message);
    });
});

router.post("/", async (req, res) => {
  try {
    const userData = await User.create(req.body);

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.username = userData.username;
      req.session.logged_in = true;

      res.status(200).json(userData);
    });
  } catch (err) {
    res.status(400).json(err);
  }
});

router.post("/login", async (req, res) => {
  try {
    const userData = await User.findOne({
      where: {
        username: req.body.username,
      },
    });

    if (!userData) {
      res
        .status(400)
        .json({ message: "Incorrect username or password, please try again." });
      return;
    }

    const validPassword = await userData.checkPassword(req.body.password);

    if (!validPassword) {
      res
        .status(400)
        .json({ message: "Incorrect username or password, please try again." });
      return;
    }

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.username = userData.username;
      req.session.avatarurl = userData.avatar;
      req.session.logged_in = true;

      res.json({ user: userData, message: "You are now logged in!" });
    });
  } catch (err) {
    res.status(400).json(err);
  }
});

router.post("/logouts", (req, res) => {
  if (req.session.logged_in) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});

router.put('/:id', withAuth , async (req, res) => {
  try {
    const [avatar] = await User.update(req.body.avatar, {
      where: {
        id: req.params.id,
      },
    });


    if (!avatar) {
      res.status(200).end();
    } else {
      res.json({ message: "Successfully updated avatar." });
      return;
    }


  } catch (err) {
    res.status(400).json(err);
   
  }
});

// router.put("/score/:id", withAuth, (req, res) => {
//   try {
//     const wins = await User.findByPk()
//   }
// });

module.exports = router;
