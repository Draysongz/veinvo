import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { User } from "../models/User";
import { logger } from "../config/logger";
import { config } from "../config/index";



const jwtSecret = config.jwt.secret;

export const register = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { fullName, email, password } = req.body ;

  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already registered." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      fullName,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign({ id: newUser._id }, jwtSecret, {
      expiresIn: "24h",
    });

    // Destructure password out, keep the rest
    const { password: _, ...safeUser } = newUser.toObject();

    return res.status(201).json({
      message: "User registered successfully.",
      token,
      user: safeUser,
    });
  } catch (error) {
    logger.error("Error during user registration:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};



export const login = async (req: Request, res: Response): Promise<Response> => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({ message: "User not found." });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordCorrect) {
      return res.status(403).json({ message: "Incorrect password." });
    }

    // Generate JWT token
    const token = jwt.sign({ id: existingUser._id }, jwtSecret, {
      expiresIn: "24h",
    });

    // Destructure to remove password
    const { password: _, ...safeUser } = existingUser.toObject();

    return res.status(200).json({
      message: "Login successful.",
      token,
      user: safeUser,
    });
  } catch (error) {
    logger.error("Error during user login:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


export const logout = () => {}

