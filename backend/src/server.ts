import express, { Express } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import userRoutes from '../routes/userRoutes'; // Adjust the path to where your userRoutes file is located
import teamRoutes from '../routes/teamRoutes'; // Adjust the path to where your teamRoutes file is located
import cookieParser from 'cookie-parser'; // Import cookie-parser
import projectRoutes from "../routes/projectRoutes";
import taskRoutes from "../routes/taskRoutes";


export { app };

dotenv.config();

const app: Express = express();

app.use(cors({
    origin: 'http://127.0.0.1:5500',
    credentials: true
}));

app.use(express.json()); // For parsing application/json
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded
app.use(cookieParser());

// Use the user routes with a specific prefix//
app.use('/api/users', userRoutes);
app.use('/teams', teamRoutes);
app.use('/api/project',projectRoutes);

app.use('/api/tasks', taskRoutes);
const PORT = process.env.PORT || 3005;

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
