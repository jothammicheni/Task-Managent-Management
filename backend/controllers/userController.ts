import { Request, Response } from 'express';
import { getXataClient } from '../src/xata';
import { generateToken } from '../utils/utils';
import bcrypt from 'bcrypt';

interface UserRecord {
    userId: number;
    email: string;
    password: string;
    name: string; 
    role?: 'user' | 'admin'; // Add role as an optional field
}

const client = getXataClient();

const sendResponse = (res: Response, status: number, message: string, data?: any) => {
    res.status(status).json({ message, data });
};

const registerUser = async (req: Request<{}, {}, UserRecord>, res: Response): Promise<void> => {
    let { email, password, name, role } = req.body; // Use let to allow reassignment

    try {
        const existingUser = await client.db.Users.filter({ email }).getFirst();

        if (existingUser) {
            return sendResponse(res, 400, 'Email already in use');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const userId = Math.floor(Math.random() * 10000);

        // Set default role if none is provided
        if (!role) {
            role = 'user'; // Default role
        }

        console.log({ userId, email, password: hashedPassword, name, role }); // Log user data

        const newUser = await client.db.Users.create({
            userID: userId,
            email,
            password: hashedPassword,
            name,
            role    
        });

        console.log('User created:', newUser); // Log the created user

        sendResponse(res, 201, 'User registered successfully', newUser);
    } catch (error) {
        console.error('Error during user registration:', error); // More specific error logging
        sendResponse(res, 500, 'Server error');
    }
};

const loginUser = async (req: Request<{}, {}, { email: string, password: string }>, res: Response): Promise<void> => {
    const { email, password } = req.body;

    try {
        const user = await client.db.Users.filter({ email }).getFirst();
        
        if (!user) {
            return sendResponse(res, 404, 'User not found');
        }

        // Compare hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (isPasswordValid) {
            const token = generateToken(user); // Pass the entire user object
            
            if (token) {
                res.cookie('token', token, {
                    path: '/',
                    httpOnly: true,
                    expires: new Date(Date.now() + 1000 * 86400), // + 1 day
                    sameSite: false,
                    secure: false // Set to true in production
                });

                const { userID, name, email, role } = user;
                res.status(200).json({
                    message: "Logged in",
                    user: { userID, name, email, role },
                    token
                });
            } else {
                res.status(400).json({ message: "Invalid Token" });
            }
        } else {
            res.status(400).json({ message: "Invalid Credentials" });
        }
    } catch (error: any) {
        console.error(error);
        sendResponse(res, 500, 'Server error');
    }
};

const deleteUser = async (req: Request<{ userID: string }>, res: Response): Promise<void> => {
    // Parse userId as a number
    const userId = parseInt(req.params.userID, 10);

    if (isNaN(userId)) {
        sendResponse(res, 400, 'Invalid user ID');
        return;
    }

    try {
        const user = await client.db.Users.filter({ userID: userId }).getFirst();

        if (user) {
            await client.db.Users.delete(user); // Delete by user ID
            sendResponse(res, 200, 'User deleted successfully');
        } else {
            sendResponse(res, 404, 'User not found');
        }
    } catch (error) {
        console.error('Error during user deletion:', error);
        sendResponse(res, 500, 'Server error');
    }
};


// Function to get all users
const getAllUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const users = await client.db.Users.getAll(); // Fetch all users
        res.status(200).json(users); // Return the list of users
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

export { registerUser, loginUser, deleteUser, getAllUsers };
