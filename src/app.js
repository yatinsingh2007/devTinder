const express = require('express')
const mongoDB = require('./config/databaseConfig')
const User = require('./models/user')
const app = express()
app.use(express.json());
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
app.post('/signUp' , async (req , res) => {
    const userData = req.body
    const userDocument = new User(userData)
    try{
        await userDocument.save()
        res.send('User Saved Successfully')
    }catch(err){
        res.status(400).send('Failed to add the User')
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
mongoDB().then(() => {
    console.log(`Connected to DataBase Successfully`)
    app.listen(7777 , () => {
        console.log(`Requests are listened on port 7777`)
    })
}).catch(err => {
    console.log(`Failed to connect to the DataBase.`)
})