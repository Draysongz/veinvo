import { Router } from "express";
import { getAllUsers, getUserById, updateUser, deleteUser } from "../controllers/User";
import { authenticate, authorize } from "../middlewares/auth"; // your auth middleware file

export const usersRouter = Router();

// 🔒 Only authenticated users can access their own profile
usersRouter.get("/me", authenticate, (req, res) => {
  res.json({ user: req.user });
});

// 👑 Admin-only: get all users
usersRouter.get("/", authenticate, authorize("admin"), getAllUsers);
  
// 🧍 Get single user (accessible only by admins or the user themselves)
usersRouter.get("/:id", authenticate, getUserById);

// ✏️ Update profile (user can update self, admin can update anyone)
usersRouter.put("/:id", authenticate, updateUser);

// ❌ Delete user (admin only)
usersRouter.delete("/:id", authenticate, authorize("admin"), deleteUser);
