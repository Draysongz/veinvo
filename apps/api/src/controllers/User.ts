import { Request, Response } from "express";
import { User } from "../models/User";
import { logger } from "../config/logger";

/**
 * @desc Get all users (admin use)
 * @route GET /v1/api/users
 */
export const getAllUsers = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const users = await User.find().select("-password"); // exclude password
    return res.status(200).json({ count: users.length, users });
  } catch (error) {
    logger.error("Error fetching users:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * @desc Get single user by ID
 * @route GET /v1/api/users/:id
 */
export const getUserById = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { id } = req.params;

  try {
    const user = await User.findById(id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    return res.status(200).json({ user });
  } catch (error) {
    logger.error("Error fetching user by ID:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * @desc Update user info (e.g., profile)
 * @route PUT /v1/api/users/:id
 */
export const updateUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
      select: "-password",
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found." });
    }

    return res.status(200).json({
      message: "User updated successfully.",
      user: updatedUser,
    });
  } catch (error) {
    logger.error("Error updating user:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * @desc Delete user
 * @route DELETE /v1/api/users/:id
 */
export const deleteUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { id } = req.params;

  try {
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found." });
    }

    return res.status(200).json({ message: "User deleted successfully." });
  } catch (error) {
    logger.error("Error deleting user:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
