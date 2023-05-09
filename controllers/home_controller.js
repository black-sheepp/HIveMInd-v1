const Post = require("../models/post");
const User = require("../models/user");

module.exports.home = async function (req, res) {
  try {
    let posts = await Post.find({})
      .populate("user")
      .sort({ createdAt: -1 })
      .populate({
        path: "comments",
        populate: {
          path: "user",
        },
      });
    let users = await User.find({}).sort({ firstName: 1 });

    return res.render("home", {
      title: "Home",
      posts: posts,
      all_users: users,
    });
  } catch (err) {
    req.flash("error", err);
    return res.redirect("back");
  }
};
