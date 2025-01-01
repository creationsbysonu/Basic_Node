
const mongoose = require('mongoose')

const ConnectionString = "mongodb+srv://admin:admin@cluster0.ua2xd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

async function ConnectToDatabase(){
    await mongoose.connect(ConnectionString)
    console.log("Connected to Database Successfully")
}


module.exports = ConnectToDatabase
