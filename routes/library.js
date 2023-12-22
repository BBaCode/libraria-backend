import express from "express";
import { getLibrary, writeNewBook } from "../controllers/LibraryController.js";

const router = express.Router();

router.route("/").post(getLibrary);
router.route("/writeBook").post(writeNewBook);

export { router };
