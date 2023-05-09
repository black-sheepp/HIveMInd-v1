const express = require("express");
const passport = require("passport");
const router = express.Router();

const usersController = require("../controllers/users_controller");

router.get(
  "/profile/:id",
  passport.checkAthentication,
  usersController.profile
);
router.get("/sign-up", usersController.signUp);
router.get("/sign-in", usersController.signIn);
router.post("/create", usersController.createUser);
router.post(
  "/create-session",
  passport.authenticate("local", { failureRedirect: "/users/sign-in" }),
  usersController.createSession
);
router.get("/sign-out", usersController.destroySession);
router.get("/update/:id",passport.checkAthentication, usersController.update);
router.post(
  "/confirm-update/:id",
  passport.checkAthentication,
  usersController.confirmUpdate
);

module.exports = router;
