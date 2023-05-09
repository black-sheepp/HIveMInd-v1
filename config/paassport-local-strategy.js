const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("../models/user");

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passReqToCallback: true
    },
    function (req, email, password, done) {
      User.findOne({ email: email })
        .then((user) => {
          if (!user) {
            req.flash('error',"Invalid Username/Password")
            console.log("Invalid Username/Password");
            return done(null, false);
          }
          if (user.password != password) {
            req.flash('error',"Invalid Username/Password")
            console.log("Invalid Username/Password");
            return done(null, false);
          }
          return done(null, user);
        })
        .catch((err) => {
          req.flash('error',err)
          return done(err);
        });
    }
  )
);

// used to serialize the user for the session
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

// used to deserialize the user
passport.deserializeUser((id, done) => {
  User.findById(id)
    .then((user) => done(null, user))
    .catch((err) => done(err));
});

// check authentication as a middleware
passport.checkAthentication = function (req, res, next) {
  // if the user is sign in
  if (req.isAuthenticated()) {
    // isAuthenticated is a passport function check whether user is authenticated
    return next();
  }
  // if user is not signin
  return res.redirect("/users/sign-in");
};

passport.setAuthenticatedUser = function (req, res, next) {
  // this middleware function is responsible for passing the authenticated user object to the views, which enables the views to access user information for rendering dynamic content.
  if (req.isAuthenticated()) {
    // req.user contains the current signed in user from the session cookie and we are just sending it to the locals for the views
    res.locals.user = req.user;
  }
  next();
};

module.exports = passport;
