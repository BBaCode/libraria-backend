import express from "express";
import {
  getAllUsers,
  loginUser,
  writeNewUser,
  logoutUser,
} from "../controllers/UsersController.js";

const router = express.Router();

router.route("/").get(getAllUsers);
router.route("/signup").post(writeNewUser);
router.route("/logout").post(logoutUser);
router.route("/login").post(loginUser);

export { router };
