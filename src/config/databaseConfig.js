const mongoose = require('mongoose')

const mongoDB = async () => {
    await mongoose.connect("mongodb+srv://yatin4591:f5v5mtmeMpJx5WVp@cluster0.pqp2zms.mongodb.net/devTinder")
}

module.exports = mongoDB