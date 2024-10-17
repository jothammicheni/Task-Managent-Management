import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { getXataClient } from '../src/xata';
import dotenv from 'dotenv';

dotenv.config();

const client = getXataClient();
// Define a custom request type
interface CustomRequest extends Request {
    user?: any; // You can replace 'any' with a specific user type if available
}

const protect =async (req: CustomRequest,res: Response, next: NextFunction): Promise<void>=> {
    const token = req.cookies.token || req.headers['authorization']?.split(' ')[1];
    console.log('secret :',process.env.JWT_TOKEN)
    console.log('token from cookie:',token)
    if (!token) {
         res.status(401).json({ message: 'No token provided, authorization denied' });
    }

    try {        
        const decoded = jwt.verify(token, process.env.JWT_TOKEN || 'your_secret');
       
        req.user = decoded; // Attach user info to request
        const email=req.user.id
        const existingUser = await client.db.Users.filter({ email }).getFirst();
        console.log("",existingUser)
        if(existingUser!==null){
           if(existingUser.role==='admin'){

           }
        }

        next(); // Continue to the next middleware or route handler
    } catch (error) {
        console.error('Token verification failed:', error);
         res.status(401).json({ message: 'Token is not valid' });
    }
};

const adminOnly = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
    const token = req.cookies.token || req.headers['authorization']?.split(' ')[1];
    // console.log('secret :',process.env.JWT_TOKEN)
    // console.log('token from cookie:',token)
    if (!token) {
         res.status(401).json({ message: 'No token provided, authorization denied' });
    }

    try {        
        const decoded = jwt.verify(token, process.env.JWT_TOKEN || 'your_secret');
        req.user = decoded; // Attach user info to request
        const email=req.user.id
        const existingUser = await client.db.Users.filter({ email }).getFirst();
      
        if(existingUser!==null){
            console.log(existingUser.role);
            if(existingUser.role==='admin'){
                next()
            }else{
                res.status(401).json({'message': 'These is admin only task'})
            }
        
        }

    }catch(error){

    }
};


export { protect,adminOnly }; 
