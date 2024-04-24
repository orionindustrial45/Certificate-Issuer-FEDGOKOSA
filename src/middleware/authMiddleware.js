import  jwt  from "jsonwebtoken";
import dotenv from 'dotenv'


dotenv.config()


export const authenticate = async(req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        if(!token) {
            return res.status(401).json({message: "Access denied. No token provided"});
        }
        const decoded = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = decoded;
        next();
        
    } catch (error) {
        if(error.name === 'TokenExpiredError') {
            return res.status(401).json({error: error.message});   
        }
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: "Invalid token" });
        }
        res.status(500).json({ message: "Internal server error" });  
    }
}