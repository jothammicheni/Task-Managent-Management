import { Router } from "express";
import { createTeam, joinTeam, leaveTeam, getTeams, getTeamMembers, updateTeam, deleteTeam, getUserTeams, getTeamById } from "../controllers/teamController";
import { protect, adminOnly } from '../middlewares/AuthMiddleware';

const router = Router();

router.post("/create", protect, adminOnly ,createTeam);
router.post("/join", protect, joinTeam);
router.post("/leave", protect, leaveTeam);
router.get("/", protect, getTeams);
router.get("/:teamId/members", protect, getTeamMembers);
router.put("/update", protect,adminOnly, updateTeam);
router.delete("/delete", protect,adminOnly, deleteTeam);
router.get("/user", protect, getUserTeams);
router.get("/:teamId", protect, getTeamById);

export default router;