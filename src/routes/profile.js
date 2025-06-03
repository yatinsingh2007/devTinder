const express = require('express');
const profileRouter = express.Router();
const userAuth = require('../middle-ware/auth');
const User = require('../models/user');
const {validateProfileEditData} = require('../utils/validation');
profileRouter.use(express.json());

profileRouter.get('/profile/view' , userAuth , async (req, res) => {
    try{
         const user = req.user;
        res.status(200).send(user)
    }catch(err){
        res.status(400).send('Something Went Wrong')
    }
})

profileRouter.patch('/profile/update' , userAuth ,  async (req , res) => {
    try{
        validateProfileEditData(req);
        const user = req.user;
        console.log(user);
        const updateData = req.body;
        console.log(updateData);
        await User.findByIdAndUpdate(user[0]._id , updateData);
        res.status(200).send('Profile Updated Successfully');
    }catch(err){
        res.status(400).send('Something Went Wrong :' + err.message);
    }
})
module.exports = profileRouter;