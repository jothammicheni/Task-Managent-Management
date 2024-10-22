import { Router } from "express";
import { createTask, getTasks, getTaskById, updateTask, deleteTask, assignTask, updateTaskStatus,filterTasksByStatus,
    filterTasksByMember,filterTasksByStatusAndMember,filterTasksByProject,filterTasksByProjectAndStatus, 
} from "../controllers/taskControllers";
import { protect, adminOnly } from '../middlewares/AuthMiddleware';
const router = Router();
router.post("/create", protect, createTask);
router.get("/", protect, getTasks);
router.get("/:id", protect, getTaskById);
router.put("/update/:id", protect, updateTask);
router.delete("/delete/:id", protect, deleteTask);
router.put("/assign/:id", protect, assignTask);
router.put("/status/:id", protect, updateTaskStatus);
router.get("/filter/status/:status", protect, filterTasksByStatus);
router.get("/filter/member/:member", protect, filterTasksByMember);
router.get("/filter/member/:memberId/status/:status", protect, filterTasksByStatusAndMember);
router.get("/filter/project/:project", protect, filterTasksByProject);
router.get("/filter/project/:project/status/:status", protect, filterTasksByProjectAndStatus);
export default router;