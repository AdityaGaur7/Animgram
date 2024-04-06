var express = require('express');
var router = express.Router();
const userModel = require("./users");
const postModel = require("./posts");
const passport = require("passport");
const upload = require("./multer");
const localStrategy = require("passport-local");
// const { redirect } = require('react-router-dom');

// const { initializeApp } = require('firebase/app');
// const { getAnalytics } = require('firebase/analytics');
// const { getStorage, ref, uploadBytes } = require('firebase/storage');
// // Your existing multer code
// const multer = require("multer");
// const {v4: uuidv4} = require("uuid");
// const path = require("path");

passport.use(new localStrategy(userModel.authenticate()));

/* GET home page. */



// router.post('/updateProfileImage', isLoggedIn, upload.single('profileImage'), async (req, res, next) => {
//   try {
//     if (!req.file) {
//       return res.status(404).send('No files were uploaded');
//     }

//     // Upload the image to Firebase Storage
//     const storageRef = ref(storage, 'profileImages/' + req.file.filename);
//     await uploadBytes(storageRef, req.file.buffer);

//     const user = await userModel.find({ username: req.session.passport.user });
//     user.dp = req.file.filename;
//     await user.save();

//     res.redirect('/profile');
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// });

// router.post('/upload', isLoggedIn, upload.single("file"), async function (req, res, next) {
//   try {
//     if (!req.file) {
//       return res.status(404).send('No files were uploaded');
//     }

//     // Upload the image to Firebase Storage
//     const storageRef = ref(storage, 'postImages/' + req.file.filename);
//     await uploadBytes(storageRef, req.file.buffer);

//     const user = await userModel.find({ username: req.session.passport.user });
//     const post = await postModel.create({
//       image: req.file.filename,
//       imageText: req.body.filecaption,
//       user: user._id,
//     });

//     user.posts.push(post._id);
//     await user.save();
//     res.redirect('/profile');
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// });


router.post('/updateProfileImage', isLoggedIn, upload.single("profileImage"), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(404).send('No files were uploaded');
    }

    const user = await userModel.findOne({ username: req.session.passport.user },null,
      { timeout: 30000 });
    user.dp = req.file.filename;
    await user.save();

    res.redirect("/profile"); // You can redirect to the profile page or any other page
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.post('/upload',isLoggedIn, upload.single("file"),async function(req, res, next) {

  if(!req.file){
    return res.status(404).send('No files were uploaded');
  }
  // res.send('file uploaded successfully');
  const user = await userModel.findOne({username:req.session.passport.user},null,
    { timeout: 30000 });
  const post = await postModel.create({
    image:req.file.filename,
    imageText:req.body.filecaption,
    user:user._id
  });

   user.posts.push(post._id);
   await user.save();
  res.redirect("/profile");
});








router.get('/', function(req, res, next) {
  res.render('index');
});



router.get('/edit',async function(req,res){
  
 
  res.render('edit');
 
})
router.get('/post',async function(req,res){
  
 
  res.render('dopost');
 
})

router.get('/feed',async function(req, res, next) {
  try {
    const posts = await postModel.find().populate('user');
    res.render('feed', { posts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
 
});

router.get('/login', function(req, res, next) {
  // console.log(req.flash("error"));
  res.render('login',{error: req.flash("error")});
});

router.get('/delete/:postId', isLoggedIn, async (req, res, next) => {
  try {
    const postId = req.params.postId;

    // Find the post by ID and delete it
    const deletedPost = await postModel.findByIdAndDelete(postId);

    if (!deletedPost) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Remove the post ID from the user's posts array
    const user = await userModel.findOne({ username: req.session.passport.user },null,
      { timeout: 30000 });
    user.posts.pull(postId);
    await user.save();

    // Redirect or send a response as needed
    res.redirect("/profile");
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


router.get('/profile',isLoggedIn, async function(req, res, next) {
  const user  = await userModel.findOne({
    username:req.session.passport.user
  },null,
  { timeout: 30000 }).populate("posts");
  console.log(user);
  res.render('profile',{user});
});





router.post("/register",function(req,res){
  const userData = new userModel({
    username: req.body.username,
    email: req.body.email,
    fullname:req.body.fullname,
  });

  userModel.register(userData,req.body.password)
  .then(function(){
    passport.authenticate("local")(req,res,function(){
    res.redirect("/profile");
    })
  })
});


router.post("/login",passport.authenticate("local",{
  successRedirect:"/profile",
  failureRedirect:"/login",
  failureFlash:true,
}),function(req,res){ });

router.get("/logout",function(req,res){
  req.logout(function(err){
    if(err){
      return next(err);
    }
    res.redirect("/");
  });
});

function isLoggedIn(req,res,next){
  if(req.isAuthenticated())return next();
  // res.redirect("/login");
}

 

module.exports = router;
