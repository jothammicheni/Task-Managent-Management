import { Request, Response } from 'express';
import { getXataClient } from './../src/xata';
import { TasksRecord } from '../types/allTypes';
import { generateToken } from '../utils/utils';
const xata = getXataClient();
export const createTask = async (req: Request, res: Response): Promise<void> => {
    try {
        const {description, status, dueDate, projectId, assignedToId} = req.body;

        const project = await xata.db.Project.filter({ projectId }).getFirst();
        const user = await xata.db.Users.filter({ xata_id: assignedToId }).getFirst();

        if(!project || !user) {
            res.status(404).json({ message: 'Project or User not found.' });
            return;
        };

        const projectXataId = project['xata_id'];
        const assignedToIdXataId = user['xata_id'];

        console.log(`Checking project with ID: ${projectXataId}`);

        const taskID = Math.floor(Math.random() * 900000) + 100000;

        const task = await xata.db.Tasks.create({
            description,
            status,
            dueDate,
            projectId: projectXataId,
            assignedToID: assignedToIdXataId,
            taskID,
        });

        res.status(201).json(task);
    } catch (error) {
        console.error('Error creating task:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
export const getTasks = async (req: Request, res: Response): Promise<void> => {
    try {
        const tasks = await xata.db.Tasks.getAll();
        res.status(200).json(tasks);
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getTaskById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        const tasks = await xata.db.Tasks.filter({ taskID: Number(id) }).getAll();

        if (tasks.length === 0) {
            res.status(404).json({ message: 'Task not found.' });
        } else {
            res.status(200).json(tasks);
        }
    } catch (error) {
        console.error('Error fetching task:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const updateTask = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { description, status, dueDate, projectId, assignedToId } = req.body;

        const tasks = await xata.db.Tasks.filter({ taskID: Number(id) }).getAll();

        if (tasks.length === 0) {
            res.status(404).json({ message: 'Task not found.' });
        } else {
            const task = tasks[0];
            const updatedTask = {
                ...task,
                description: description || task.description,
                status: status || task.status,
                dueDate: dueDate || task.dueDate,
                projectId: projectId || task.projectId,
                assignedToId: assignedToId || task.assignedToID,
            };

            await xata.db.Tasks.update(task.xata_id, updatedTask);

            res.status(200).json(task);
        }
    } catch (error) {
        console.error('Error updating task:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const deleteTask = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const task = await xata.db.Tasks.delete(id);

        if (!task) {
            res.status(404).json({ message: 'Task not found.' });
        } else {
            res.status(200).json({ message: 'Task deleted successfully.' });
        }
    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const assignTask = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { assignedToId } = req.body;

        const tasks = await xata.db.Tasks.filter({ taskID: Number(id) }).getAll();

        if (tasks.length === 0) {
            res.status(404).json({ message: 'Task not found.' });
        } else {
            const task = tasks[0];
            const updatedTask = {
                ...task,
                assignedToID: assignedToId,
            };

            await xata.db.Tasks.update(task.xata_id, updatedTask);

            res.status(200).json(task);
        }
    } catch (error) {
        console.error('Error assigning task:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const updateTaskStatus = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const tasks = await xata.db.Tasks.filter({ taskID: Number(id) }).getAll();

        if (tasks.length === 0)
            res.status(404).json({ message: 'Task not found.' });
        else {
            const task = tasks[0];
            const updatedTask = {
                ...task,
                status: status,
            };

            await xata.db.Tasks.update(task.xata_id, updatedTask);

            res.status(200).json(task);
        }
    } catch (error) {
        console.error('Error updating task status:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
export const filterTasksByStatus = async (req: Request, res: Response): Promise<void> => {
    try {
        const { status } = req.params;

        const tasks = await xata.db.Tasks.filter({ status }).getAll();

        if (tasks.length === 0) {
            res.status(404).json({ message: 'Tasks not found.' });
        } else {
            res.status(200).json(tasks);
        }
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
export const filterTasksByMember = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        const tasks = await xata.db.Tasks.filter({ assignedToID: id }).getAll();

        if (tasks.length === 0) {
            res.status(404).json({ message: 'Tasks not found.' });
        } else {
            res.status(200).json(tasks);
        }
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
export const filterTasksByStatusAndMember = async (req: Request, res: Response): Promise<void> => {
    try {
        const { status, id } = req.params;

        const tasks = await xata.db.Tasks.filter({ status, assignedToID: id }).getAll();

        if (tasks.length === 0) {
            res.status(404).json({ message: 'Tasks not found.' });
        } else {
            res.status(200).json(tasks);
        }
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
export const filterTasksByProject = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        const tasks = await xata.db.Tasks.filter({ projectId: id }).getAll();

        if (tasks.length === 0) {
            res.status(404).json({ message: 'Tasks not found.' });
        } else {
            res.status(200).json(tasks);
        }
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
export const filterTasksByProjectAndStatus = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id, status } = req.params;

        const tasks = await xata.db.Tasks.filter({ projectId: id, status }).getAll();

        if (tasks.length === 0) {
            res.status(404).json({ message: 'Tasks not found.' });
        } else {
            res.status(200).json(tasks);
        }
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
export const filterTasksByProjectAndMember = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id, memberId } = req.params;

        const tasks = await xata.db.Tasks.filter({ projectId: id, assignedToID: memberId }).getAll();

        if (tasks.length === 0) {
            res.status(404).json({ message: 'Tasks not found.' });
        } else {
            res.status(200).json(tasks);
        }
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
export const filterTasksByProjectMemberAndStatus = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id, memberId, status } = req.params;

        const tasks = await xata.db.Tasks.filter({ projectId: id, assignedToID: memberId, status }).getAll();

        if (tasks.length === 0) {
            res.status(404).json({ message: 'Tasks not found.' });
        } else {
            res.status(200).json(tasks);
        }
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
export const filterTasksByProjectAndDueDate = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id, dueDate } = req.params;

        const tasks = await xata.db.Tasks.filter({ projectId: id, dueDate }).getAll();

        if (tasks.length === 0) {
            res.status(404).json({ message: 'Tasks not found.' });
        } else {
            res.status(200).json(tasks);
        }
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}