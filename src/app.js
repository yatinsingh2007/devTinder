const express = require('express')

const app = express()

app.use("/",(req , res) => {
    if (req.url == '/test'){
        res.send('Yes yes Working')
    }else if(req.url == '/home'){
        res.send(`Oh My god Such a homie.`)
    }
    res.send(`Hello from the server!`) 

})
app.listen(7777 , () => {
    console.log(`Server is successfully listening in port 3000`);
})