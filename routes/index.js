var express = require('express');
var router = express.Router();
const userModel = require("./users");
const postModel = require("./posts");
const passport = require("passport");
const upload = require("./multer");
const localStrategy = require("passport-local");


passport.use(new localStrategy(userModel.authenticate()));

router.post('/updateProfileImage', isLoggedIn, upload.single("profileImage"), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(404).send('No files were uploaded');
    }

    const user = await userModel.findOne({ username: req.session.passport.user }, null,
      { timeout: 30000 });
    user.dp = req.file.filename;
    await user.save();

    res.redirect("/profile"); // You can redirect to the profile page or any other page
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.post('/upload', isLoggedIn, upload.single("file"), async function (req, res, next) {

  if (!req.file) {
    return res.status(404).send('No files were uploaded');
  }
  // res.send('file uploaded successfully');
  const user = await userModel.findOne({ username: req.session.passport.user }, null,
    { timeout: 30000 });
  const post = await postModel.create({
    image: req.file.filename,
    imageText: req.body.filecaption,
    user: user._id
  });

  user.posts.push(post._id);
  await user.save();
  res.redirect("/profile");
});


router.get('/', function (req, res, next) {
  res.render('index');
});



router.get('/edit', async function (req, res) {


  res.render('edit');

})
router.get('/post', async function (req, res) {


  res.render('dopost');

})

router.get('/feed', async function (req, res, next) {
  try {
    const posts = await postModel.find()
      .populate('user')
      .populate('likes', 'username fullname')
      .populate('comments.user', 'username fullname dp')
      .sort({ createdAt: -1 });
    res.render('feed', { posts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }

});

router.get('/login', function (req, res, next) {
  // console.log(req.flash("error"));
  res.render('login', { error: req.flash("error") });
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
    const user = await userModel.findOne({ username: req.session.passport.user }, null,
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


router.get('/profile', isLoggedIn, async function (req, res, next) {
  const user = await userModel.findOne({
    username: req.session.passport.user
  }).populate({
    path: "posts",
    populate: {
      path: "likes comments.user",
      select: "username fullname dp"
    }
  });
  console.log(user);
  res.render('profile', { user });
});





router.post("/register", function (req, res) {
  const userData = new userModel({
    username: req.body.username,
    email: req.body.email,
    fullname: req.body.fullname,
  });

  userModel.register(userData, req.body.password)
    .then(function () {
      passport.authenticate("local")(req, res, function () {
        res.redirect("/profile");
      })
    })
});


router.post("/login", passport.authenticate("local", {
  successRedirect: "/profile",
  failureRedirect: "/login",
  failureFlash: true,
}), function (req, res) { });

// Like/Unlike post
router.post('/like/:postId', isLoggedIn, async (req, res) => {
  try {
    const postId = req.params.postId;
    const userId = req.session.passport.user;

    const user = await userModel.findOne({ username: userId });
    const post = await postModel.findById(postId);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const isLiked = post.likes.includes(user._id);

    if (isLiked) {
      // Unlike
      post.likes.pull(user._id);
      post.likeCount = post.likes.length;
    } else {
      // Like
      post.likes.push(user._id);
      post.likeCount = post.likes.length;
    }

    await post.save();
    res.json({ liked: !isLiked, likeCount: post.likeCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Add comment
router.post('/comment/:postId', isLoggedIn, async (req, res) => {
  try {
    const postId = req.params.postId;
    const userId = req.session.passport.user;
    const { text } = req.body;

    const user = await userModel.findOne({ username: userId });
    const post = await postModel.findById(postId);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    post.comments.push({
      user: user._id,
      text: text
    });

    await post.save();

    // Populate the comment with user info
    await post.populate('comments.user', 'username fullname dp');

    const newComment = post.comments[post.comments.length - 1];
    res.json({
      comment: {
        _id: newComment._id,
        text: newComment.text,
        user: {
          username: newComment.user.username,
          fullname: newComment.user.fullname,
          dp: newComment.user.dp
        },
        createdAt: newComment.createdAt
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Follow/Unfollow user
router.post('/follow/:userId', isLoggedIn, async (req, res) => {
  try {
    const targetUserId = req.params.userId;
    const currentUserId = req.session.passport.user;

    const currentUser = await userModel.findOne({ username: currentUserId });
    const targetUser = await userModel.findById(targetUserId);

    if (!targetUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isFollowing = currentUser.following.includes(targetUserId);

    if (isFollowing) {
      // Unfollow
      currentUser.following.pull(targetUserId);
      targetUser.followers.pull(currentUser._id);
    } else {
      // Follow
      currentUser.following.push(targetUserId);
      targetUser.followers.push(currentUser._id);
    }

    await currentUser.save();
    await targetUser.save();

    res.json({
      following: !isFollowing,
      followerCount: targetUser.followers.length,
      followingCount: currentUser.following.length
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Search users
router.get('/search', isLoggedIn, async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) {
      return res.json({ users: [] });
    }

    const users = await userModel.find({
      $or: [
        { username: { $regex: query, $options: 'i' } },
        { fullname: { $regex: query, $options: 'i' } }
      ]
    }).select('username fullname dp followers following');

    res.json({ users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Get user profile by ID
router.get('/user/:userId', isLoggedIn, async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await userModel.findById(userId).populate('posts');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.render('user-profile', { user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.get("/logout", function (req, res) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/login");
}



module.exports = router;
