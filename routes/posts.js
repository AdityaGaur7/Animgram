const mongoose = require('mongoose');



// let url = "mongodb://127.0.0.1:27017/mydb";
let url = "mongodb+srv://adkumar7112:adgaur7112@data.dbvduwf.mongodb.net/?retryWrites=true&w=majority";


mongoose.connect(url);

const postSchema = new mongoose.Schema({
  imageText: {
    type: String,
    required: true,
  },
  image:{
     type:String

  },
  user:{
  type:mongoose.Schema.Types.ObjectId,
  ref:'User'
  
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  likes: {
    type: Array,
    default: [],
  },
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
