import express from "express";
import { getAllUsers } from "../controllers/UsersController.js";

const router = express.Router();

router.route("/").get(getAllUsers);

export { router };
