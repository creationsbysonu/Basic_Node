const express = require('express')
const app = express()
const mongoose = require('mongoose')
const fs = require('fs')

const ConnectToDatabase = require('./database/index')
const Book = require('./model/bookModel')

//multerconfig imports
const multer = require("./middleware/multerConfig").multer
const storage = require("./middleware/multerConfig").storage
const upload = multer({storage : storage})

//cors package require
const cors = require('cors')

app.use(cors({
    origin : '*'
}))

app.use(express.json()) //very important to retrieve data from postman //must include here and explanation in notes // if not included then undefined shown when data is posted through postman

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
        imageUrl : fileName
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
            if(!book){
                res.status(400).json({
                    message : "Nothing Found"
                })
            }else{
                res.status(200).json({
                    message : "Single Data fetched successfully",
                    data : book
                })
            }
            console.log(book)
    

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
    const oldDatas = await Book.findById(id);
    let fileName
        if (!oldDatas) {
            return res.status(404).json({ message: "Book not found" });
        }

    if (req.file){
        const OldImagePath = oldDatas.imageUrl
        console.log(OldImagePath)
        const localHostUrlLength = 'http://localhost:3000/'.length
        const newOldImagePath = OldImagePath.slice(localHostUrlLength)
        console.log(newOldImagePath)
        fs.unlink(`storage/${newOldImagePath}`,(err)=>{
            if(err){
                console.log(err)
            }else{
                console.log("File Deleted Successfully")
            }
        })
        fileName= "http://localhost:3000/" + req.file.filename
    }
    
    await Book.findByIdAndUpdate(id,{

        bookName : bookName,
        bookPrice : bookPrice,
        isbnNumber : isbnNumber,
        publishedAt : publishedAt,
        authorName : authorName,
        publication : publication,
        imageUrl : fileName
        
    
    })

    res.status(200).json({
    message : "Book Updated successfully"
    })


})


app.use(express.static("./storage"))


app.listen(3000,()=>{
    console.log("Nodejs Hello Port Testing and connected to port:3000")
})

