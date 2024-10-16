import { sign } from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

interface User {
    email: string; // Adjust this based on your actual user model
}

const generateToken = (user: User): string => {
    const jwtSecret = process.env.JWT_TOKEN as string;

    if (!jwtSecret) {
        throw new Error("JWT_TOKEN environment variable is not defined");
    }

    const payload = {
        id: user.email,
    };
    
    return sign(payload, jwtSecret, { expiresIn: '1d' });
};

export {generateToken}