import express, { Express } from 'express';
import dotenv from 'dotenv';
import userRoutes from '../routes/userRoutes'; // Adjust the path to where your userRoutes file is located
import cookieParser from 'cookie-parser'; // Import cookie-parser


dotenv.config();

const app: Express = express();
app.use(express.json()); // For parsing application/json
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded
app.use(cookieParser());

// Use the user routes with a specific prefix
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 3005;

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
