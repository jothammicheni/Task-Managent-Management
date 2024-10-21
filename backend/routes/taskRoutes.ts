import { Router } from "express";
import { createTask, getTasks, getTaskById, updateTask, deleteTask, assignTask, updateTaskStatus,filterTasksByStatus,
    filterTasksByMember,filterTasksByStatusAndMember,filterTasksByProject,filterTasksByProjectAndStatus, filterTasksByProjectAndMember,
    filterTasksByProjectMemberAndStatus 
} from "../controllers/taskControllers";
import { protect, adminOnly } from '../middlewares/AuthMiddleware';
const router = Router();
router.post("/create", protect, createTask);
router.get("/", protect, getTasks);
router.get("/:id", protect, getTaskById);
router.put("/update", protect, updateTask);
router.delete("/delete", protect, deleteTask);
router.put("/assign", protect, assignTask);
router.put("/status", protect, updateTaskStatus);
router.get("/filter/status/:status", protect, filterTasksByStatus);
router.get("/filter/member/:member", protect, filterTasksByMember);
router.get("/filter/status/:status/member/:member", protect, filterTasksByStatusAndMember);
router.get("/filter/project/:project", protect, filterTasksByProject);
router.get("/filter/project/:project/status/:status", protect, filterTasksByProjectAndStatus);
router.get("/filter/project/:project/member/:member", protect, filterTasksByProjectAndMember);
router.get("/filter/project/:project/member/:member/status/:status", protect, filterTasksByProjectMemberAndStatus);
export default router;