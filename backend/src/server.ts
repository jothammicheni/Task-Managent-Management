import express, { Express } from 'express';
import dotenv from 'dotenv';


dotenv.config();

const app: Express = express();
app.use(express.json());

const PORT = process.env.PORT || 3005;  





// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});