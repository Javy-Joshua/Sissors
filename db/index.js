const mongoose = require('mongoose')
const dotenv = require('dotenv')

dotenv.config()

const connect = async (url) => {
    mongoose.connect(url || process.env.MONGODB_URL || 'mongodb://localhost:27017/Sissors');

    mongoose.connection.on("connected", () => {
        console.log("Connected to MongoDB successfully")
    })

    mongoose.connection.on('error', (err) =>{
        console.log("an error occured while connecting to MongoDB")
        console.log(err)
    })
}

module.exports = {
    connect
}