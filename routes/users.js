import express from "express";
import {
  getAllUsers,
  loginUser,
  writeNewUser,
} from "../controllers/UsersController.js";

const router = express.Router();

router.route("/").get(getAllUsers);
router.route("/signup").post(writeNewUser);
router.route("/login").post(loginUser);

export { router };
