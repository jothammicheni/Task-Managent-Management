import { Request, Response } from 'express';
import { getXataClient } from './../src/xata';
import jwt from 'jsonwebtoken';

const xata = getXataClient();

const createTeam = async (req: Request, res: Response): Promise<void> => {
    try {
        const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
        if (!token) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        const decoded: any = jwt.verify(token, process.env.JWT_TOKEN!);
        // const userId = decoded.id;

        const user = await xata.db.Users.filter({ email: decoded.id }).getFirst();

        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        const userId = user['xata_id'];


        const { name, description } = req.body;
        if (!name || !description) {
            res.status(400).json({ message: 'Name and description are required' });
            return;
        }

        const teamId = Math.floor(100 + Math.random() * 900);

        const newTeam = await xata.db.Teams.create({
            teamId,
            name,
            description,
            adminId: userId
        });

        res.status(201).json(newTeam);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

const joinTeam = async (req: Request, res: Response): Promise<void> => {
    try {
        const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
        if (!token) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        const decoded: any = jwt.verify(token, process.env.JWT_TOKEN!);
        const user = await xata.db.Users.filter({ email: decoded.id }).getFirst();

        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        const userId = user['xata_id'];
        const { teamId } = req.body;

        // Fetch the team using the integer teamId
        const team = await xata.db.Teams.filter({ teamId }).getFirst();
        if (!team) {
            res.status(404).json({ message: 'Team not found' });
            return;
        }

        // Use the xata_id of the team for the teamId field
        const teamXataId = team['xata_id'];

        // Check if the user is already a member of the team
        const existingMembership = await xata.db.TeamMembers.filter({ teamId: teamXataId, userID: userId }).getFirst();
        if (existingMembership) {
            res.status(400).json({ message: 'User is already a member of the team' });
            return;
        }

        await xata.db.TeamMembers.create({
            teamId: teamXataId, // Use the xata_id of the team
            userID: userId      // Use the xata_id of the user
        });

        res.status(200).json({ message: 'Joined team successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

const leaveTeam = async (req: Request, res: Response): Promise<void> => {
    try {
        const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
        if (!token) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        const decoded: any = jwt.verify(token, process.env.JWT_TOKEN!);
        const user = await xata.db.Users.filter({ email: decoded.id }).getFirst();

        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        const userId = user['xata_id'];
        const { teamId } = req.body;

        if (!teamId) {
            res.status(400).json({ message: 'Team ID is required' });
            return;
        }

        // Fetch the team using the integer teamId
        const team = await xata.db.Teams.filter({ teamId }).getFirst();
        if (!team) {
            res.status(404).json({ message: 'Team not found' });
            return;
        }

        // Use the xata_id of the team for the teamId field
        const teamXataId = team['xata_id'];

        // Check if the user is a member of the team
        const teamMember = await xata.db.TeamMembers.filter({ teamId: teamXataId, userID: userId }).getFirst();
        if (!teamMember) {
            res.status(404).json({ message: 'Membership not found' });
            return;
        }

        await xata.db.TeamMembers.delete(teamMember['xata_id']);

        res.status(200).json({ message: 'Left team successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

const updateTeam = async (req: Request, res: Response): Promise<void> => {
    try {
        const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
        if (!token) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        const decoded: any = jwt.verify(token, process.env.JWT_TOKEN!);
        const user = await xata.db.Users.filter({ email: decoded.id }).getFirst();

        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        if (user.role !== 'admin') {
            res.status(403).json({ message: 'Forbidden: Only admins can update teams' });
            return;
        }

        const { teamId, name, description } = req.body;

        const team = await xata.db.Teams.filter({ teamId }).getFirst();
        if (!team) {
            res.status(404).json({ message: 'Team not found' });
            return;
        }

        const updatedTeam = await xata.db.Teams.update(team['xata_id'], {
            name,
            description
        });

        res.status(200).json(updatedTeam);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

const deleteTeam = async (req: Request, res: Response): Promise<void> => {
    try {
        const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
        if (!token) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        const decoded: any = jwt.verify(token, process.env.JWT_TOKEN!);
        const user = await xata.db.Users.filter({ email: decoded.id }).getFirst();

        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        if (user.role !== 'admin') {
            res.status(403).json({ message: 'Forbidden: Only admins can delete teams' });
            return;
        }

        const { teamId } = req.body;

        const team = await xata.db.Teams.filter({ teamId }).getFirst();
        if (!team) {
            res.status(404).json({ message: 'Team not found' });
            return;
        }

        await xata.db.Teams.delete(team['xata_id']);

        res.status(200).json({ message: 'Team deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

const getTeams = async (req: Request, res: Response): Promise<void> => {
    try {
        const teams = await xata.db.Teams.getAll();
        res.status(200).json(teams);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

const getTeamMembers = async (req: Request, res: Response): Promise<void> => {
    try {
        const teamMembers = await xata.db.TeamMembers.getAll();
        res.status(200).json(teamMembers);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export { createTeam, joinTeam, leaveTeam, getTeams, getTeamMembers, updateTeam, deleteTeam };