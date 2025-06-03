const express = require('express')
const mongoDB = require('./config/databaseConfig')
const app = express()
app.use(express.json());
const authRouter = require('./routes/auth')
const profileRouter = require('./routes/profile')
const requestRouter = require('./routes/request')

app.use('/' , authRouter)
app.use('/' , profileRouter)
app.use('/' , requestRouter)
mongoDB().then(() => { 
    console.log(`Connected to DataBase Successfully`)
    app.listen(7777 , () => {
        console.log(`Requests are listened on port 7777`)
    })
}).catch(err => {
    console.log(`Failed to connect to the DataBase.`)
})  