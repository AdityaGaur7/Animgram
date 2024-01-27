const mongoose = require('mongoose');
const plm = require("passport-local-mongoose");
// const { use } = require('.');

// let url = "mongodb://localhost:27017/myappdb";

let url = "mongodb+srv://adkumar7112:ZZF1W9wv25IVSVGe@testcluster.qod1yun.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(url,{
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
   
  },
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
    },
  ],
  dp: {
    type: String, // Assuming a string for the profile picture URL or file path
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  fullname: {
    type: String,
    required: true,
  },
});

userSchema.plugin(plm);
const User = mongoose.model('User', userSchema);

module.exports = User;
