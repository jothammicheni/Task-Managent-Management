import { Router } from "express";
import { createTeam, joinTeam, leaveTeam, getTeams, getTeamMembers, updateTeam, deleteTeam } from "../controllers/teamController";
import { protect, adminOnly } from '../middlewares/AuthMiddleware';

const router = Router();

router.post("/create", protect, createTeam);
router.post("/join", protect, joinTeam);
router.post("/leave", protect, leaveTeam);
router.get("/", protect, getTeams);
router.get("/members", protect, getTeamMembers);
router.put("/update", protect,adminOnly, updateTeam);
router.delete("/delete", protect,adminOnly, deleteTeam);

export default router;