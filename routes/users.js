import express from "express";
import { getAllUsers, writeNewUser } from "../controllers/UsersController.js";

const router = express.Router();

router.route("/").get(getAllUsers);
router.route("/signup").post(writeNewUser);

export { router };
