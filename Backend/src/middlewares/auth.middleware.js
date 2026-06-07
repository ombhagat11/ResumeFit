const jwt = require('jsonwebtoken');
const tokenBlacklist = require('../models/blacklist.model');


async function authUser(req, res, next) {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({message: 'Unauthorized, token is missing'});
    }
    const isTokenBlacklisted = await tokenBlacklist.findOne({ token });

    if(isTokenBlacklisted) {
        return res.status(401).json({message: 'Unauthorized, token is blacklisted'});
    }
     



 try{
    const decoded=   jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;
    next();


 }catch(err){
    return res.status(401).json({message: 'Unauthorized, invalid token'});
 }
}


module.exports = {authUser};