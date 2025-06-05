import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

const secretKey = process.env.JWT_SECRET_KEY || 'DEBUTATION-2025'

const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        
        if (!token) {
            return res.status(401).json({
                message: 'Unauthorized - No token provided.'
            });
        }

        const decoded = jwt.verify(token, secretKey);
        if (!decoded) {
            return res.status(401).json({
                message: 'Unauthorized - Invalid token.'
            });
        }

        const existingUser = await User.findById(decoded.userId).select('-password');
        if (!existingUser) {
            return res.status(401).json({
                message: 'Unauthorized - User not found.'
            });
        }

        req.user = existingUser.toObject({getters: true});

        next();
    } catch (error) {
        console.log(`Error in protectRoute: ${error.message}`);
        return res.status(500).json({
            message: 'Internal Server Error'
        });
    }
    
};

export default protectRoute;