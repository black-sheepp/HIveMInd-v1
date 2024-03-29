const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const port = 8000;
const expressLayouts = require("express-ejs-layouts");
const db = require("./config/mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocal = require("./config/paassport-local-strategy");
const passportJWT = require("./config/passport-jwt-stratergy");
const MongoStore = require("connect-mongo");
const sassMiddleware = require("node-sass-middleware");
const flash = require("connect-flash");
const flashMiddleware = require("./config/flashMiddleware");

app.use(
     sassMiddleware({
          src: "./assets/scss",
          dest: "./assets/css",
          debug: true,
          outputStyle: "extended",
          prefix: "/css",
     })
);

app.use(express.urlencoded());
app.use(cookieParser());

app.use(express.static("./assets"));

// makes the path available to the browser
app.use("/uploads", express.static(__dirname + "/uploads"));

app.use(expressLayouts);
app.set("layout extractStyles", true);
app.set("layout extractScripts", true);

// set up the view eninge
app.set("view engine", "ejs");
app.set("views", "./views");

// mongo store used to store the session cookie in the db
app.use(
     session({
          name: "HiveMind",
          secret: "todoinpromode",
          saveUninitialized: false,
          resave: false,
          cookie: {
               maxAge: 1000 * 60 * 100,
          },
          store: MongoStore.create({
               mongoUrl: "mongodb://127.0.0.1:27017/HiveMind_Dev",
               autoRemove: "disabled",
          }),
     })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);
app.use(flash());
app.use(flashMiddleware.setFlash);

app.use("/", require("./routes/index"));

app.listen(port, function (err) {
     if (err) {
          console.log("Error running server on port:", port);
     }
     console.log("Server is up and running on port:", port);
});
