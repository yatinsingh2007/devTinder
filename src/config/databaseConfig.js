const mongoose = require('mongoose')

const mongoDB = async () => {
    await mongoose.connect("mongodb+srv://yatin4591:knO4v5kam6UGyr94@cluster0.lliungu.mongodb.net/devTinder")
}

module.exports = mongoDB