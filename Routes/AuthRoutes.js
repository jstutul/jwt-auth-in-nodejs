import express from "express";
const router = express.Router();
import { register, login } from "../Controllers/AuthControllers.js";
import { checkUser } from "../Middlewares/authMiddleware.js";

router.post("/", checkUser);
router.post("/register", register);
router.post("/login", login);

export default router;
