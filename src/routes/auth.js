const express = require('express');
const {validateSignUpdata} = require('../utils/validation');
const authRouter = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/user');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');


authRouter.use(cookieParser());
authRouter.use(express.json());

authRouter.post('/signup' , async (req , res) => {
    try {
            validateSignUpdata(req)
            const {password} = req.body;
            const hashedPassword = await bcrypt.hash(password, 10);
            const userData = {...req.body, password: hashedPassword};
            const userDocument = new User(userData);
            await userDocument.save();
            res.status(201).send('User Saved Successfully');
    } catch (err) {
        res.status(400).send('ERROR: ' + err.message);
    }

})

authRouter.post('/login' , async (req , res) => {
    try{
        const {emailId, password} = req.body;
        const ourUser = await User.find({emailId})
        if (!ourUser || ourUser.length === 0) {
            return res.status(404).send('User not found');
        }else{
            const isPasswordValid = await bcrypt.compare(password, ourUser[0].password);
            if (isPasswordValid) {
                const token = jwt.sign({_id : ourUser[0]._id}, 'Thalaforareason', {expiresIn: '7d'});
                res.cookie('token' , token, {
                    expires : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                }).status(200).send('Login Successful');
            } else {
                res.status(401).send('Invalid Credenutials');
            }
        }
    }catch(err){
        res.status(400).send('ERROR: ' + err.message);
    }
})

authRouter.post('/logout' , (req, res) => {
    res.cookie('token' , null , {
        expires : new Date(Date.now())
    }).status(200).send('Logout Successful');
}) 

module.exports = authRouter;