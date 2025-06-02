const express = require('express')
const mongoDB = require('./config/databaseConfig')
const User = require('./models/user')
const bcrypt = require('bcrypt')
const validate = require('validator')
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken')
const userAuth = require('./middle-ware/auth') 
const {validateSignUpData} = require('./utils/validation')
const app = express()
app.use(express.json());
app.use(cookieParser());
app.get('/user' , async (req , res) => {
    const email = req.body.emailId
    try{
        const user = await User.find({emailId : email})
        if (user.length === 0){
            res.status(404).send('User not found')
        }else{
            res.send(user)
        }
    }catch(err){ 
        res.status(400).send('Something Went Wrong')
    }
})
app.get('/feed' , async (req , res) => {
    try{
        const users = await User.find({})
        if (users.length === 0){
            res.status(404).send('Something Went Wrong')
        }else{
            res.send(users)
        }
    }catch(err){
        res.status(404).send('Something Went Wrong')
    }  
})
app.post('/signup' , async (req , res) => {
    try{
        validateSignUpData(req);
        const {password} = req.body
        const passwordHash = await bcrypt.hash(password , 10)
        const userData = req.body
        userData.password = passwordHash
        const userDocument = new User(userData)
        await userDocument.save()
        res.send('User Saved Successfully')
    }catch(err){
        res.status(400).send('ERROR: ' + err.message)
    }
})
app.get('/id' , async (req , res) => {  
    const objId = req.body.id
    try{
        const result = await User.findById(objId)
        res.send(`Are You Searching for ${result.firstName}`)
    }catch(err){
        res.status(404).send('Something went wrong')
    }
})

app.delete('/user' , async (req , res) => {
    const userId = req.body._id
    try{
        const result = await User.findByIdAndDelete(userId)
        res.send('User deleted Successfully')
    }catch(err){
        res.status(404).send('Something went wrong')
    }
})

app.patch('/user/:userId' , async (req , res) => {
    try{
        const userId = req.params?.userId
        const data = req.body
        const ALLOWED_UPDATES = ['photoUrl' , 'about' , 'skills' ,"age" , "gender"]
        const isAllowed = Object.keys(data).every((key) => ALLOWED_UPDATES.includes(key))
        if (!isAllowed){
            throw new Error('Invalid Update Request')
        }
        const result = await User.findByIdAndUpdate(userId , data , {
            returnDocument : "after",
            runValidators : true
        }) 
        res.send("Updated Successfully")
    }catch(err){
        res.status(404).send('Update Failed:' + err.message)
    } 
})

app.post('/login' , async(req , res) => {
    try{
        const emailId = req.body.emailId
        const password = req.body.password
        if( !validate.isEmail(emailId)){
            throw new Error('Email is not valid')
        }
        const datafromDb = await User.find({emailId})
        if (datafromDb.length === 0){
            throw new Error('User not found')
        }
        const isPasswordValid = await bcrypt.compare(password , datafromDb[0].password)
        if (!isPasswordValid){
            throw new Error('Invalid credentials')
        }else{
            const token = jwt.sign({_id : datafromDb[0]._id} , "Thalaforareason" , {
                expiresIn : '1d'
            });
            res.cookie("token" , token)
            res.send('Login Successful')
        }
    }catch(err){
        res.status(400).send('ERROR: ' + err.message)
    }
})
 
app.get('/profile' , userAuth , (req , res) => {
    user = req.user
    res.send(user)
})

app.post("/sendConnectionRequest" , userAuth ,  async (req , res) => {

})
mongoDB().then(() => { 
    console.log(`Connected to DataBase Successfully`)
    app.listen(7777 , () => {
        console.log(`Requests are listened on port 7777`)
    })
}).catch(err => {
    console.log(`Failed to connect to the DataBase.`)
})  