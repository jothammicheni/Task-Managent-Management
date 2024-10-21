import { Request, Response } from 'express';
import { getXataClient } from './../src/xata';

const xata = getXataClient(); 



export const createProject = async (req: Request, res: Response): Promise<void> => {
  try {
      const { name, teamId } = req.body;

      // Validate input
      if (!name || !teamId) {
          res.status(400).json({ message: 'Name and teamId are required.' });
          return;
      }

      const projectId = Math.floor(Math.random() * 900000) + 100000;

      // Check if the team exists
      const teamExists = await xata.db.Teams.filter({ teamId }).getFirst();
      if (!teamExists) {
          res.status(404).json({ message: 'Team not found.' });
          return;
      }

      // Team found, create the project
      const id = teamExists['xata_id'];
      const project = await xata.db.Project.create({
          name,
          projectId,
          teamId: id,
      });

      // Send response with the created project
      res.status(201).json(project);
  } catch (error) {
      console.error('Error creating project:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
};
  

export const getProjects = async (req: Request, res: Response): Promise<void>  => {
  try {
    const projects = await xata.db.Project.getAll();
   res.status(200).json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
   res.status(500).json({ message: 'Internal server error' });
  }
};

export const getProjectById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params; 
  
      const projects = await xata.db.Project
        .filter({ projectId: Number(id) }) 
        .getAll();
  
      if (projects.length === 0) {
        res.status(404).json({ message: 'Project not found' });
      }
      
      res.status(200).json(projects[0]); // Return the first project found
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching project' });
    }
  };

export const updateProject = async (req: Request, res: Response): Promise<void> => {
 
  }; 
  
  


export const deleteProject = async (req: Request, res: Response): Promise<void>  => {
  try {
    const { id } = req.params;
    const project = await xata.db.Project.delete(id);

    if (!project) {
     res.status(404).json({ message: 'Project not found' });
    }

  res.status(204).send(); // No content
  } catch (error) {
    console.error('Error deleting project:', error);
 res.status(500).json({ message: 'Internal server error' });
  }
};
