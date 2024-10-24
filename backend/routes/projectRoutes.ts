import express from 'express';
import {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  getProjectsByTeamId,
} from '../controllers/projectController';

const router = express.Router();

// Route to create a new project
router.post('/add', createProject);

// Route to get all projects
router.get('/getAll', getProjects);

// Route to get a single project by ID
router.get('/:id', getProjectById);

// Route to update a project by ID
router.put('/update/:id', updateProject);

// Route to delete a project by ID
router.delete('/delete/:id', deleteProject);

// Route to get all projects by team ID
router.get('/team/:teamId', getProjectsByTeamId);

export default router;
