const express = require('express')
const app = express()
const mongoose = require('mongoose')


const ConnectToDatabase = require('./database/index')
const Book = require('./model/bookModel')

//multerconfig imports
const multer = require("./middleware/multerConfig").multer
const storage = require("./middleware/multerConfig").storage
const upload = multer({storage : storage})

app.use(express.json()) //very important to retrieve data from postman //must include here and explanation in notes // if not included then undefined shown when data is postred through postman

ConnectToDatabase()

//Alternative , const app = require('express')()

// app.get("/",(req,res)=>{
//     res.send("Laughing world")
// })

// app.get("/",(req,res)=>{

//     res.json("Laughing World") //.json used for universal understanding for any frontend and backend.

// })



app.get("/",(req,res)=>{

    res.status(200).json({
        message : "haha world"}) //.json used for universal understanding for any frontend and backend.
    
})

//craete book
app.post("/book",upload.single("image"),async (req,res)=>{
    console.log(req.file)
    let fileName ;
    if(!req.file){
        fileName = "https://hatrabbits.com/wp-content/uploads/2017/01/random.jpg"
    }else{
            fileName = "http://localhost:3000/" + req.file.filename
        }
    
    const {bookName,bookPrice,isbnNumber,publishedAt,authorName,publication} = req.body
    const data = await Book.create({
        bookName,
        bookPrice,
        isbnNumber,
        publishedAt,
        authorName,
        publication,
        imageUrl : req.file.filename
    })
    
    console.log(data)
   
    res.status(200).json({
        message : "Book Created successfully"
    })
    
}),

//all read
app.get("/book",async(req,res)=>{
    const books = await Book.find() //returns array ma garxa
    console.log(books)
    res.status(200).json({
        message : "Book fetched successfully",
        data : books
    })
    
}),

//single read
app.get("/book/:id",async(req,res)=>{
    const id = req.params.id
    const book = await Book.findById(id)
    console.log(book)
    res.status(200).json({
        message : "Single Data fetched successfully",
        data : book
    })

})



//delete operation
app.delete("/book/:id",async(req,res)=>{

    const id = req.params.id
    await Book.findByIdAndDelete(id)

    res.status(200).json({
        message : "Data deleted successfully"
    })
})


//.Update operation
app.patch("/book/:id",upload.single('image'), async (req,res)=>{
    const id = req.params.id //ID CATCH - kun book ko update garne ho tesko lagi ho
    const {bookName,bookPrice,isbnNumber,publishedAt,authorName,publication} = req.body
    const oldDatas = await Book.findById(id)
    await Book.findByIdAndUpdate(id,{

        bookName : bookName,
        bookPrice : bookPrice,
        isbnNumber : isbnNumber,
        publishedAt : publishedAt,
        authorName : authorName,
        publication : publication,
        imageUrl : req.file.filename
    
    })

    res.status(200).json({
    message : "Book Updated successfully"
    })


})


app.use(express.static("./storage"))


app.listen(3000,()=>{
    console.log("Hello Port Testing")
})

