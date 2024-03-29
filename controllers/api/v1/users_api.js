const jwt = require("jsonwebtoken");
const User = require("../../../models/user");

module.exports.createSession = async function (req, res) {
  try {
    let user = await User.findOne({ email: req.body.email });

    if (!user || user.password != req.body.password) {
      return res.json(422, {
        message: "Invalid Username/Password",
      });
    }

    return res.json(200, {
      message: "Sign In Successfull, Here is yoour token, Please keep it safe",
      data: {
        token: jwt.sign(user.toJSON(), "hivemind", { expiresIn: "10000" }),
      },
    });
    
  } catch (err) {
    console.log("****************", err);
    return res.json(500, {
      message: "Internal Server Error",
    });
  }
};
