import { Router } from 'express';
import { registerUser, loginUser, getAllUsers, deleteUser } from '../controllers/userController';
import { protect,adminOnly } from '../middlewares/AuthMiddleware';

const router = Router();

// Define the POST route for user registration
router.post("/register",registerUser);

// Define the POST route for user login
router.post("/login", loginUser);

// Protect the following routes with the `protect` middleware
router.get("/", protect,adminOnly,getAllUsers);

// Route to delete a user, also protected
router.delete("/:userId",protect,adminOnly,deleteUser);

export default router;
