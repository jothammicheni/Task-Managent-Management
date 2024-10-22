import { Request, Response } from "express";
import { getXataClient } from "../src/xata";
import jwt from "jsonwebtoken";

const xata = getXataClient();

const addComment = async (req: Request, res: Response): Promise<void> => {
    try{
        const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

        if(!token) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        const decoded: any = jwt.verify(token, process.env.JWT_TOKEN!) as jwt.JwtPayload;
        const user = await xata.db.Users.filter({ email: decoded.id }).getFirst();

        let userId: string | undefined;

        if(!user) {
            res.status(404).json({ message: "User not found" });
            return;
        } else {
            userId = user["xata_id"];
        }

        const { taskId, content } = req.body;

        if(!taskId || !content) {
            res.status(400).json({ message: "Task ID and content are required" });
        }

        const task = await xata.db.Tasks.filter({ xata_id: taskId }).getFirst();

        if(!task) {
            res.status(404).json({ message: "Task not found" });
            return;
        }

        const newComment = await xata.db.Comments.create({
            taskID: task,
            userID: userId,
            content,
            
        });
        
        res.status(201).json(newComment);

    }
    catch(error){
        res.status(500).json({ message: "Server error", error });
    }
};


const getCommentsByTask = async (req: Request, res: Response): Promise<void> => {
    try {
        const { taskId } = req.params;

        const comments = await xata.db.Comments.filter({ taskID: taskId }).getAll();

        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

const getCommentsByUser = async (req: Request, res: Response): Promise<void> => {

    try {
        const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

        if(!token) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        const decoded: any = jwt.verify(token, process.env.JWT_TOKEN!) as jwt.JwtPayload;
        const user = await xata.db.Users.filter({ email: decoded.id }).getFirst();

        let userId: string | undefined;

        if(!user) {
            res.status(404).json({ message: "User not found" });
            return;
        } else {
            userId = user["xata_id"];
        }

        const comments = await xata.db.Comments.filter({ userID: userId }).getAll();

        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }

};

const getAllComments = async (req: Request, res: Response): Promise<void> => {
    try {
        const comments = await xata.db.Comments.getAll();

        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export { addComment, getCommentsByTask, getCommentsByUser, getAllComments };