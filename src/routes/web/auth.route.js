import { Router } from "express";
import { login, loginPage, logout, signup, signupPage } from "../../controllers/web/auth.controller.js";
const router = Router();
router.get("/signup", signupPage).post("/signup", signup);
router.get("/login", loginPage).post("/login", login);
router.post("/logout", logout);
export default router;
