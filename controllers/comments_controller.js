const Comment = require("../models/comment");
const Post = require("../models/post");

module.exports.create = async function (req, res) {
  try {
    let post = await Post.findById(req.body.post);
    if (post) {
      let comment = await Comment.create({
        content: req.body.content,
        post: req.body.post,
        user: req.user._id,
      });
      post.comments.push(comment);
      post.save();
      req.flash("success", "Comment Published");
      res.redirect("/");
    }
  } catch (err) {
    req.flash("error", "Cannot Post Empty String");
    return res.redirect("back");
  }
};

module.exports.destroy = async function (req, res) {
  try {
    let comment = await Comment.findById(req.params.id);
    if (comment.user == req.user.id) {
      let postId = comment.post;
      comment.deleteOne();
      req.flash("success", "Comment Deleted");
      await Post.findByIdAndUpdate(postId, {
        $pull: { comments: req.params.id },
      });
      res.redirect("back");
    } else {
      res.redirect("back");
    }
  } catch (err) {
    req.flash("error", err);
    return res.redirect("back");
  }
};
