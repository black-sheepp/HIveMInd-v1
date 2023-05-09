const User = require("../models/user");
const fs = require("fs");
const path = require("path");

module.exports.profile = async function (req, res) {
  try {
    let user = await User.findById(req.params.id);
    return res.render("profile", {
      title: "Profile",
      profile_user: user,
    });
  } catch (err) {
    req.flash("error", err);
    return res.redirect("back");
  }
};

module.exports.signUp = function (req, res) {
  if (req.isAuthenticated()) {
    return res.redirect("/users/profile");
  }
  return res.render("sign_up", {
    title: "Sign Up",
  });
};

module.exports.signIn = function (req, res) {
  if (req.isAuthenticated()) {
    return res.redirect("/users/profile");
  }
  return res.render("sign_in", {
    title: "Sign In",
  });
};

module.exports.createUser = async function (req, res) {
  if (req.body.password != req.body.confirm_password) {
    return res.redirect("back");
  }
  try {
    let user = await User.findOne({ email: req.body.email });
    if (!user) {
      let user = await User.create(req.body);
      return res.redirect("/users/sign-in");
    } else {
      req.flash("success", "User Created!");
      return res.redirect("back");
    }
  } catch (err) {
    console.log("error in finding user in signing up");
    req.flash("error", err);
    return res.redirect("back");
  }
};

module.exports.createSession = function (req, res) {
  req.flash("success", "Logged in Successfully!");
  return res.redirect("/");
};

module.exports.destroySession = function (req, res) {
  // req.logout();
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash("success", "You have Logged Out!");
    res.redirect("/");
  });
};

module.exports.update = async function (req, res) {
  try {
    let user = await User.findById(req.params.id);

    return res.render("updateProfile", {
      title: "Update Profile",
      profile_user: user,
    });
  } catch (err) {
    req.flash("error", err);
    return res.redirect("back");
  }
};

module.exports.confirmUpdate = async function (req, res) {
  if (req.user.id == req.params.id) {
    try {
      let user = await User.findByIdAndUpdate(req.params.id);
      User.uploadedAvatar(req, res, function (err) {
        if (err) {
          console.log("********* Multer error: ", err);
        }
        user.firstName = req.body.firstName;
        user.lastName = req.body.lastName;
        user.email = req.body.email;
        user.phone = req.body.phone;
        user.address = req.body.address;
        user.password = req.body.password;
        user.jobProfile = req.body.jobProfile;
        user.companyName = req.body.companyName;
        user.skills = req.body.skills;
        user.linkedIn = req.body.linkedIn;
        user.github = req.body.github;

        if (req.file) {
          if (user.avatar) {
            fs.unlinkSync(path.join(__dirname, "..", user.avatar));
          }
          // this is saving the path of the uploaded file into the avatar field as a string in the user schema
          user.avatar = User.avatarPath + "/" + req.file.filename;
        }
        user.save();
        req.flash("success", "Profile Updated!");
        return res.redirect("back");
      });
    } catch (err) {
      req.flash("error", err);
      return res.redirect("back");
    }
  } else {
    req.flash("error", "Unauthorized");
    return res.redirect("back");
  }
};
