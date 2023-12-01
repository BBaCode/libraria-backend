import express from "express";
import {
  getAllLibaries,
  writeNewBook,
} from "../controllers/LibraryController.js";

const router = express.Router();

router.route("/").get(getAllLibaries);
router.route("/writeBook").post(writeNewBook);
// router.route("/logout").post(logoutUser);
// router.route("/login").post(loginUser);

export { router };
