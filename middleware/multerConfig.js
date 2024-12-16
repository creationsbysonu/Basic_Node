const multer = require('multer')

const storage = multer.diskStorage({
    destination : function(req,file,cb){
        const allowedFileTypes = ['image/png','image/jpeg','image/jpg', 'video/mp4', 'video/x-matroska']
        if (!allowedFileTypes.includes(file.mimetype)){
            cb(new Error("This filetype is not supported"))
            return
        }
        cb(null,'./storage') // --> cb(error,success)   cb=callback
    },
    filename : function(req,file,cb){
        cb(null,Date.now()+"-"+ file.originalname)
    }
})

module.exports = {
    storage,
    multer
}
