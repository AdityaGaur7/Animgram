const mongoose = require('mongoose');
const plm = require("passport-local-mongoose");
// const { use } = require('.');

// let url = "mongodb://127.0.0.1:27017/mydb";
let url = "mongodb+srv://adkumar7112:adgaur7112@data.dbvduwf.mongodb.net/?retryWrites=true&w=majority";



mongoose.connect(url);

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
