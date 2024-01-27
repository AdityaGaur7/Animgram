const multer = require("multer");
const {v4:uuidv4} = require("uuid");
const path = require("path");



const storage = multer.diskStorage({
    destination:function(req, file, cb){
        cb(null,'./public/images/uploads')
},
filename:function(req,file,cb){

    const uniquename = uuidv4();
    cb(null,uniquename+path.extname(file.originalname));
}
});

const upload = multer({storage:storage})

module.exports = upload;


// // Import the necessary Firebase modules
// const { initializeApp } = require('firebase/app');
// const { getAnalytics } = require('firebase/analytics');
// const { getStorage, ref, uploadBytes } = require('firebase/storage');
// // Your existing multer code
// const multer = require("multer");
// const {v4: uuidv4} = require("uuid");
// const path = require("path");

// // Initialize your Firebase app
// const firebaseConfig = {
//   apiKey: "AIzaSyCimeg533tmm29UUwjows_VRHmDSlPDw-g",
//   authDomain: "imageupload-ded28.firebaseapp.com",
//   projectId: "imageupload-ded28",
//   storageBucket: "imageupload-ded28.appspot.com",
//   messagingSenderId: "956847690305",
//   appId: "1:956847690305:web:94f18f6a7db42f86b4acc0",
//   measurementId: "G-XW7M7X4DQJ"
// };

// const app = initializeApp(firebaseConfig);
// const storage = getStorage(app);


// const storageConfig = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, './public/images/uploads');
//   },
//   filename: function (req, file, cb) {
//     const uniquename = uuidv4();
//     cb(null, uniquename + path.extname(file.originalname));
//   }
// });

// const upload = multer({ storage: storageConfig });

// module.exports={upload};


