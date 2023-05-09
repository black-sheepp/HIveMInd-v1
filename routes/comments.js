const express = require("express");
const passport = require("passport");
const router = express.Router();

const commentsController = require("../controllers/comments_controller");

router.post("/create", passport.checkAthentication, commentsController.create);
router.get("/destroy/:id", passport.checkAthentication,commentsController.destroy)

module.exports = router;
