import express from "express";
import { getAllLibaries } from "../controllers/LibraryController.js";

const router = express.Router();

router.route("/").get(getAllLibaries);
// router.route("/signup").post(writeNewUser);
// router.route("/logout").post(logoutUser);
// router.route("/login").post(loginUser);

export { router };
