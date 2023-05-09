const express = require("express");
const passport = require("passport");
const router = express.Router();

const postController = require("../controllers/posts_controller");
const { route } = require("./comments");

router.post("/create", passport.checkAthentication, postController.create);
router.get("/destroy/:id", passport.checkAthentication, postController.destroy);

module.exports = router;
