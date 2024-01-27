const mongoose = require('mongoose');

// let url = "mongodb+srv://adkumar7112:anime123@myapp.pgt6ifm.mongodb.net/";

let url = "mongodb://localhost:27017/myappdb";

mongoose.connect(url,{
  useNewUrlParser: true,
  useUnifiedTopology: true
});

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
