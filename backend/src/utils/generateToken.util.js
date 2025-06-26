import jwt from 'jsonwebtoken';

const secretKey = process.env.JWT_SECRET_KEY || 'DEBUTATION-2025'

const generateToken = (userId, res) => {
    // generate token lasting for 30 days
    const token = jwt.sign({userId}, secretKey, {
        expiresIn: '30d'
    });

    // add a cookie to the response 
    res.cookie('jwt', token, {
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30days in ms
        httpOnly: true, // prevent XSS attacks cross-site scripting attacks
        sameSite: 'None', // CSRF attacks cross-site request forgery attacks
        secure: process.env.NODE_ENV === 'production' // only set secure cookies in production environment
    });

    return token;
};

export default generateToken;
