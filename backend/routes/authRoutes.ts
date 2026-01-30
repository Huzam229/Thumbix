import express from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
  verifyUser,
} from "../controllers/authController.js";
import protect from "../middleWares/auth.js";

const AuthRouter = express.Router();

AuthRouter.post("/register", registerUser);
AuthRouter.post("/login", loginUser);
AuthRouter.post("/logout", protect, logoutUser);
AuthRouter.get("/verify", protect, verifyUser);

export default AuthRouter