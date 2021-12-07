var express = require('express');
var router = express.Router();
const mongoose = require("mongoose");
const Users = require("../models/User");
const Comments = require("../models/Comments");
const Post = require("../models/Post");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const passport = require('passport');
const authToken = require("../auth/auth.js")
const multer = require("multer")
const storage = multer.memoryStorage();
const upload = multer({ storage })
const { body, validationResult } = require('express-validator');


router.get('/', function(req, res, next) {
    console.log(req.body);
    res.json({ msg: 'ok' });
})
router.post('/', function(req, res, next) {
    console.log(req.body);
    res.json({ msg: 'ok' });
})


//register new user
const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
router.post('/register',
    body('email').isEmail(),
    body("password").isLength({ min: 8 }),
    //https://github.com/express-validator/express-validator/issues/486 how to check using express-validator
    body('password').matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.* )(?=.*[^a-zA-Z0-9])/, 'i'),
    (req, res, next) => {
        console.log(req.body);

        //get current date and time
        var currentDay = new Date();
        var updateDate = currentDay.getDate() + "/" + (currentDay.getMonth() + 1) + "/" + currentDay.getFullYear();
        var updateTime = currentDay.getHours() + ":" + currentDay.getMinutes();
        var fullUpdateTime = updateTime + " " + updateDate;


        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log("found errors");
            /*for (let i = 0; i < errors.array().length; i++) {
                if (errors.array()[i].param == "password") {
                    console.log("found errors:pwd");
                    return res.status(403).json({ success: false, msg: "Password is not strong enough" });
                }
            }*/
            return res.status(403).json({ success: false, msg: "Password not strong enough" });
        }
        Users.findOne({ username: req.body.username }, (err, user) => {
            if (err) throw err;

            //if has user already
            if (user) {
                return res.status(403).json({
                    success: false,
                    msg: "Username already in use"
                });
                //if no user-> create one
            } else {
                //using brcypt to crypt the passaword
                bcrypt.genSalt(10, (err, salt) => {
                    //cryptes the password
                    bcrypt.hash(req.body.password, salt, (err, crypted_password) => {
                        //if error --> discard it
                        if (err) throw err;
                        //create new user with the crypted password
                        Users.create({
                            name: req.body.name,
                            email: req.body.email,
                            username: req.body.username,
                            password: crypted_password,
                            bio: req.body.bio,
                            registerdate: fullUpdateTime
                        });
                        console.log("account createad");
                        return res.json({ success: true, msg: 'registered new user' });
                    });
                });
            }
        });

    });
//TODO ADD GOOGLE LOGIN
//login using user 
router.post('/login', upload.none(), (req, res, next) => {

    //find the user
    console.log("finding user:" + req.body.username);
    console.log("finding password:" + req.body.password);


    Users.findOne({ username: req.body.username }, (err, user) => {
        //discard error
        console.log(user);
        if (err) throw err;

        //no user by that email
        if (!user) {

            return res.status(403).send({ success: false, msg: "Invalid credentials" });
        } else {

            //check the password using brycpt
            bcrypt.compare(req.body.password, user.password, (err, matches) => {
                //discard error
                if (err) throw err;

                //if the passwords are the same
                if (matches) {
                    //create jwt token 
                    const jwtPayload = {
                        id: user._id,
                        name: user.name,
                        email: user.email,
                        username: user.username,
                        password: user.password,
                        posts: user.posts,
                        comments: user.comments,
                        bio: user.bio,
                        registerdate: user.registerdate

                    };
                    console.log(process.env.SECRET);
                    //secret is from the .env file 
                    var token = jwt.sign(
                        jwtPayload,
                        'secret', {
                            expiresIn: 10000
                        });

                    //return res.redirect('/');
                    res.json({ success: true, token: token, msg: 'Logged in' });
                } else {
                    res.status(403).send({ success: false, token: token, msg: 'Invalid credentials' });
                }
            });
        }
    });
});
//get all of the posts 
router.get("/posts", (req, res, next) => {

    console.log("getting all of the posts");

    //get all posts
    Post.find({}, (err, posts) => {
        if (err) return next(err);

        //if posts found
        if (posts) {

            return res.send(posts);
        } else {
            //no posts found
            return res.status(404).send("No posts found!");
        }
    });

});
//get all of the post comments
router.get("/post/comments/:id", (req, res, next) => {

    console.log("getting all of the post comments");

    //get all comments
    Comments.find({ postID: req.params.id }, (err, comments) => {
        if (err) return next(err);
        console.log(comments);
        //if got comments return them
        if (comments) {
            return res.json(comments);
        } else {
            //if no comments return empty
            return res.json([]);
        }
    });

});
//add new comment
router.post("/addcomment", passport.authenticate('jwt', { session: false }), (req, res, next) => {
    //console.log(req.body);
    //get current date and time
    var currentDay = new Date();
    var updateDate = currentDay.getDate() + "/" + (currentDay.getMonth() + 1) + "/" + currentDay.getFullYear();
    var updateTime = currentDay.getHours() + ":" + currentDay.getMinutes();
    var fullUpdateTime = updateTime + " " + updateDate;
    console.log(req.body);

    //add new comment to db
    let newComment = new Comments({
        userID: req.body.userID,
        username: req.body.username,
        postID: req.body.postID,
        content: req.body.content,
        date: fullUpdateTime
    }).save((err) => {
        if (err) {
            res.json({ success: false, msg: "failed to add comment" });
            throw next(err);

        };
        console.log("saved new comment");
    });

    console.log(req.body.postID);
    //add new comment to post comment. content and username 
    /*let postComment = [
        [req.body.content, req.body.username]
    ];
    Post.findByIdAndUpdate({ _id: req.body.postID }, { $push: { comments: postComment } }, (err, success) => {
        if (err) throw err;

        if (!success) {
            res.json({ success: false, msg: "failed to modify post" });
        }
    });

    //find the new created comment and get its id
    Comments.findOne({ userID: req.body.userID, username: req.body.username, postID: req.body.postID, content: req.body.content }, (err, comment) => {
        //found the comment
        if (comment) {
            //add new comment to user 
            Users.findByIdAndUpdate({ _id: req.body.userID }, { $push: { comments: comment._id } }, (err, success) => {
                if (err) throw err;

                if (!success) {
                    res.json({ success: false, msg: "failed to modify post" });
                }
            });
        } else {
            console.log("did not find the comment");
        }
    });*/



    res.json({ success: true, msg: "Added comment" });
});
//add new post
router.post("/addpost", passport.authenticate('jwt', { session: false }), (req, res, next) => {
    console.log(req.body);

    //get current date and time
    var currentDay = new Date();
    var updateDate = currentDay.getDate() + "/" + (currentDay.getMonth() + 1) + "/" + currentDay.getFullYear();
    var updateTime = currentDay.getHours() + ":" + currentDay.getMinutes();
    var fullUpdateTime = updateTime + " " + updateDate;


    //add new post to db
    let newPost = new Post({
        userID: req.body.userID,
        username: req.body.username,
        title: req.body.title,
        content: req.body.content,
        Date: fullUpdateTime,
        Comments: [],
        Votes: 0
    }).save((err) => {
        if (err) {
            res.json({ success: false, msg: "Failed to add post" });


        };
        console.log("saved new post");
    });

    //add the created post to users posts
    //find the new created post and get its id
    /*Post.findOne({ userID: req.body.userID, username: req.body.username, title: req.body.title, content: req.body.content }, (err, post) => {
        //found the comment
        if (post) {
            //add new comment to user 
            Users.findByIdAndUpdate({ _id: req.body.userID }, { $push: { posts: post._id } }, (err, success) => {
                if (err) throw err;

                if (!success) {
                    res.json({ success: false, msg: "failed to modify add " });
                }
            });
        } else {
            console.log("did not find the post");
        }
    });*/

    res.json({ success: true, msg: "Your post was added" });
});

//update user object to add posts to it
router.post("/update/user", passport.authenticate('jwt', { session: false }), (req, res, next) => {
    //get values from the req object
    const userID = req.body.userID;
    const postTitle = req.body.title;


    //get post id for the post ot be added to user's posts
    Post.findOne({ userID: userID, title: postTitle }, (err, post) => {
            if (err) throw err;

            //if post was found(should find it always)
            if (post) {
                var postID = post._id;
                //add post to users posts
                console.log("Found the post");
                console.log(post);

                //update the user post array. Add id of the post to it
                Users.findOneAndUpdate({ _id: userID }, { $push: { posts: postID } }, (err, success) => {
                    if (err) throw err;
                    if (!success) {
                        res.json({ success: false, msg: "failed to add post" });
                    } else {
                        res.json({ success: true, msg: "Post was added for the correct user" });
                    }
                });

            } else {
                console.log("No post found. Something went wrong...");
            }
        })
        //console.log(req.body);
});
//update a post content
router.post("/update/post/content", passport.authenticate('jwt', { session: false }), (req, res, next) => {

    //set new content
    Post.findByIdAndUpdate({ _id: req.body._id }, { $set: { content: req.body.content, date: req.body.date } }, (err, success) => {
        if (err) throw err;

        if (!success) {
            res.json({ success: false, msg: "failed to modify post" });
        }
    });

});
//update a post votes
router.post("/post/votes", passport.authenticate('jwt', { session: false }), (req, res, next) => {

    //all votes
    let allVotes = [];
    let newOne = true;

    //get current post
    console.log("finding post with id:" + req.body._id);
    console.log("user is:" + req.body.username);
    Post.findById({ _id: req.body._id }, (err, post) => {
        if (post) {
            for (let i = 0; i < post.votes.length; i++) {

                //has already given like or dislike
                if (post.votes[i][0] == req.body.username) {
                    newOne = false;
                    console.log("has given some vote");
                    //check if the given vote is different
                    console.log(post.votes[i][1], req.body.vote);
                    if (post.votes[i][1] == req.body.vote) {
                        console.log("Already given same vote");
                        return res.json({ success: false, msg: "Already liked the post" });
                    } else {
                        console.log("Adding a new vote");
                        //add the new vote to end of the array
                        allVotes.push([req.body.username, req.body.vote])

                    }

                } else {
                    //add all of the votes to array
                    allVotes.push(post.votes[i]);
                }
            }


            //havent given a vote before
            if (newOne) {
                allVotes.push([req.body.username, req.body.vote]);
            }
            //add new vote
            Post.findByIdAndUpdate({ _id: req.body._id }, { $set: { votes: allVotes } }, (err, success) => {
                allVotes = [];
                if (err) throw err;

                if (!success) {
                    res.json({ success: false, msg: "failed to modify post" });
                } else {
                    res.json({ success: success, msg: "Vote added" });
                }
            });

        }
    });


});


//update a post commetns
router.post("/post/comment", passport.authenticate('jwt', { session: false }), (req, res, next) => {

    console.log("################################################################");
    Comments.findOne({content : req.body.content, postID : req.body.postID, username:req.body.username}, (err, comment)=>{
        console.log("Found the comment");
        console.log(comment);
        if(comment){
            Post.findOneAndUpdate({ _id: req.body.postID },{ $push: { comments: comment._id } }, (err, success) => {
                if (err) throw err;
        
                //if post was found(should find it always)
                if (success) {
                    return res.json({msg:comment._id});
        
                } else {
                    console.log("No post found. Something went wrong...");
                    return res.json("failed to add comment to post" );
                }
               
            });
        }
    });
    
});

//update a commetns of the user
router.post("/user/comment", passport.authenticate('jwt', { session: false }), (req, res, next) => {

    console.log("################################################################");
  

    Users.findOneAndUpdate({ _id: req.body.userID },{ $push: { comments:req.body.commentID } }, (err, success) => {
        if (err) throw err;

        //if post was found(should find it always)
        if (success) {
            return res.json('comment added to users');

        } else {
            console.log("No post found. Something went wrong...");
            return res.json("failed to add comment to users" );
        }
        
    });
        

    
});
//update a comment 
router.post("/update/comment", passport.authenticate('jwt', { session: false }), (req, res, next) => {

    //set new content
    Comments.findByIdAndUpdate({ _id: req.body._id }, { $set: { content: req.body.content, date: req.body.date } }, (err, success) => {
        if (err) throw err;

        if (!success) {
            res.json({ success: false, msg: "failed to modify comment" });
        }
    });

});

//remove a post
router.post("/remove/post", passport.authenticate('jwt', { session: false }), (req, res, next) => {
    // console.log(req.body);
    let updatedUserPosts = [];

    //find the post and remove it from the post collection
    Post.findByIdAndRemove({ _id: req.body._id }, (err, success) => {
        //discard error
        if (err) throw err;


        //was removed from posts 
        if (success) {

            //first get all user posts
            User.findById({ _id: req.body.userID }, (err, user) => {
                if (err) throw err;

                //found the user
                if (user) {
                    for (let i = 0; i < user.posts.length; i++) {
                        //if post not the removed one
                        if (user.posts[i] != req.body._id) {
                            updatedUserPosts.push(user.posts[i]);
                        }
                    }

                    //remove post from the user also
                    User.findByIdAndUpdate({ _id: req.body.userID }, { $set: { posts: updatedUserPosts } }, (err, success) => {
                        if (err) throw err;

                        if (success) {
                            res.json({ success: true, msg: "removed post from the user" });

                        } else {
                            res.json({ success: false, msg: "failed to remove post" });
                        }
                    });

                } else {
                    res.json({ success: false, msg: "failed to remove post" });
                }
            });
        } else {
            res.json({ success: false, msg: "failed to remove post" });
        }

    });
});



router.get("/profile", (req, res, next) => {
    //    console.log("getting current user");
    //  console.log("current user:" + req.user);
    res.json({ user: req.user });
});
router.get("/profile/:username", (req, res, next) => {

    console.log("getting user:" + req.params.username);
    Users.findOne({ username: req.params.username }, (err, user) => {
        if (err) return next(err);

        if (user) {
            console.log(user);
            return res.json(user);
        } else {
            return res.status(404).send("No user found!");
        }
    });

});
//get a post by its id
router.get("/post/:id", (req, res, next) => {

    //console.log(req.params.id);
    //find the post by id
    Post.findById({ _id: req.params.id }, (err, post) => {
        //console.log(post);
        if (err) return next(err);

        if (post) {

            return res.json(post);
        } else {
            return res.status(404).send("No post found!");
        }
    });

});
module.exports = router;