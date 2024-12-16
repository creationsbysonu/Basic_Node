const mongoose = require ("mongoose")

const bookSchema = new mongoose.Schema({
    bookName :{
            type : String,
            unique : true
    },
    bookPrice :{
            type : String
    },
    isbnNumber :{
            type : Number
    },
    publishedAt :{
            type : Date
    },
    authorName :{
            type : String
    },
    publication :{
            type : String
    },
    imageUrl :{
            type : String
    }
})


const Book = mongoose.model('Book',bookSchema)
module.exports = Book