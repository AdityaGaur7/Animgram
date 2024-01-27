const mongoose = require('mongoose');



// let url = "mongodb://localhost:27017/myappdb";
let url = "mongodb+srv://adkumar7112:ZZF1W9wv25IVSVGe@testcluster.qod1yun.mongodb.net/?retryWrites=true&w=majority";


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
