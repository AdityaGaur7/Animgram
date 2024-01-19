var express = require('express');
var router = express.Router();
const userModel = require("./users");
const postModel = require("./posts");
const passport = require("passport");
const upload = require("./multer");
const localStrategy = require("passport-local");
const { redirect } = require('react-router-dom');
passport.use(new localStrategy(userModel.authenticate()));

/* GET home page. */


router.get('/', function(req, res, next) {
  res.render('index');
});


router.post('/upload',isLoggedIn, upload.single("file"),async function(req, res, next) {

  if(!req.file){
    return res.status(404).send('No files were uploaded');
  }
  // res.send('file uploaded successfully');
  const user = await userModel.findOne({username:req.session.passport.user});
  const post = await postModel.create({
    image:req.file.filename,
    imageText:req.body.filecaption,
    user:user._id
  });

   user.posts.push(post._id);
   await user.save();
  res.redirect("/profile");
});

router.get('/feed',async function(req, res, next) {
  const user  = await postModel.find();
  console.log(user);
  res.render('feed',{user});
 
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
    const user = await userModel.findOne({ username: req.session.passport.user });
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
  }).populate("posts");
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
  res.redirect("/login");
}

 

module.exports = router;
