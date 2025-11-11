import { Router } from "express";
import { login, register, logout } from "../controllers/auth";

export const authRouter = Router();

// Register route
authRouter.post("/register", register);

// Login route
authRouter.post("/login", login);

//Logout route
authRouter.post("/logout", logout)