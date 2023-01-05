require("dotenv").config();
const express = require("express");
const path = require("path");
const session = require("express-session");
const bodyParser = require("body-parser");
const exphbs = require("express-handlebars");
//. const helpers = require("./utils/helpers");

const sequelize = require("./config");
const SequelizeStore = require("connect-session-sequelize")(session.Store);

const app = express();

const sess = {
  secret: "Super secret secret",
  cookie: {
    maxAge: 300000,
    httpOnly: true,
    secure: false,
    sameSite: "strict",
  },
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize,
  }),
};

app.use(session(sess));

// const hbs = exphbs.create({ helpers });

// inform express.js which template engine to use
// app.engine("handlebars", hbs.engine);
// app.set("view engine", "handlebars");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/", require("./controllers"));

// Handlebars setting
app.set("view engine", "hbs");
app.engine(
  "hbs",
  exphbs.engine({
    extname: "hbs",
    defaultLayout: "index",
    layoutsDir: __dirname + "/views/layouts",
    partialsDir: __dirname + "/views/partials",
  })
);

// const port = 3001;
// app.listen(port);
// console.log(`Listening to server: http://localhost:${port}`);

// Landing page
app.get("/", (req, res) => {
  res.render("main");
});

sequelize
  .sync()
  .then(() => app.listen(3001, () => console.log("App listening on port 3001")))
  .catch((err) => console.error(err));
