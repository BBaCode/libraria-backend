import express from "express";
import {
  getAllUsers,
  loginUser,
  writeNewUser,
  writeNewGoogleUser,
  writeNewParentUser,
  logoutUser,
  writeNewChildUser,
} from "../controllers/UsersController.js";

const router = express.Router();

router.route("/").get(getAllUsers);
router.route("/signup/new").post(writeNewUser);
router.route("/signup/google").post(writeNewGoogleUser);
router.route("/signup/parent").post(writeNewParentUser);
router.route("/signup/child").post(writeNewChildUser);
router.route("/logout").post(logoutUser);
router.route("/login").post(loginUser);

export { router };
