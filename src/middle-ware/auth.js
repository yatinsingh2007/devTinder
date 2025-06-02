const jwt = require('jsonwebtoken');
const User = require('../models/user');
const userAuth = async (req , res , next) => {

    try{
        const { token } = req.cookies;
        if (!token) {
            return res.status(401).send('No token provided');
        }
        const decodedData = await jwt.verify(token, "Thalaforareason");
        const { _id } = decodedData;
        const user = await User.find({ _id });
        if (!user || user.length === 0) {
            return res.status(404).send('User not found');
        }
        req.user = user
        next()
    }catch(err){
        res.status(401).send('Authentication failed: ' + err.message);
    }
}

module.exports =  userAuth 