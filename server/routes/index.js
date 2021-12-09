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
        console.log(errors);
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
                        registerdate: user.registerdate,
                        admin: false,
                        upvotesPost: [],
                        downvotesPost: [],
                        upvotesComment: [],
                        downvotesComment: []

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
            console.log(posts);
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

    //get current date and time
    var currentDay = new Date();
    var updateDate = currentDay.getDate() + "/" + (currentDay.getMonth() + 1) + "/" + currentDay.getFullYear();
    var updateTime = currentDay.getHours() + ":" + currentDay.getMinutes();
    var fullUpdateTime = updateTime + " " + updateDate;

    //set new content
    Post.findByIdAndUpdate({ _id: req.body._id }, { $set: { title: req.body.title, content: req.body.content, date: fullUpdateTime } }, (err, success) => {
        if (err) throw err;

        if (!success) {
            res.json({ success: false, msg: "failed to modify post" });
        } else {
            res.json({ success: true, msg: "post modfied" });
        }
    });

});
//update a post votes
router.post("/post/votes", passport.authenticate('jwt', { session: false }), (req, res, next) => {
    let vote = 0;
    let prevVote = 0;
    let hasupVoted = false;
    let hasdownVoted = false;
    let upvotesList = [];
    let downvotesList = [];
    //get previous vote 
    Users.findById({_id: req.body.userID} ,(err, user)=>{
        
        if(user){

            //check if already upvoted
            for(let i=0; i<user.upvotesPost.length; i++){
                if(user.upvotesPost[i]==req.body._id){
                    hasupVoted = true;
                }else{
                    //add votes to list
                    upvotesList.push(user.upvotesPost[i]);
                }
            }


            //check if already down voted
            for(let i=0; i<user.downvotesPost.length; i++){
                if(user.downvotesPost[i]==req.body._id){
                    hasdownVoted = true;
                }else{
                    //add votes to list
                    downvotesList.push(user.downvotesPost[i]);
                }
            }

            //has given both --> problem 
            if(hasdownVoted && hasupVoted){
                return res.json({ success: false, msg: "has both upvoted and downvoted" });
            }



            //check for like or dislike
            if(req.body.vote == 1){
                console.log('is like');    

                //if has down voted-->remove it
                if(hasdownVoted){
                    Users.findByIdAndUpdate({ _id: req.body.userID }, { $set: { downvotesPost: downvotesList } }, (err, success) => {
                        if (err) throw err;
                
                        if (!success) {
                            res.json({ success: false, msg: "failed to remove dislike" });
                        } else {
                            console.log('dislike removed-->adding like');
                        }
                    });
                }


                //already given a like--> remove the like
                if(hasupVoted){
                    Users.findByIdAndUpdate({ _id: req.body.userID }, { $set: { upvotesPost: upvotesList } }, (err, success) => {
                        if (err) throw err;
                
                        if (!success) {
                            res.json({ success: false, msg: "failed to remove like" });
                        } else {
                            res.json({ success: true, msg: "like removed" });
                        }
                    });
                }else{
                    //add the like
                    Users.findByIdAndUpdate({ _id: req.body.userID }, { $push: { upvotesPost: req.body._id } }, (err, success) => {
                        if (err) throw err;
                
                        if (!success) {
                            res.json({ success: false, msg: "failed to add like" });
                        } else {
                            res.json({ success: true, msg: "like added" });
                        }
                    });
                }

            }else{
                console.log('is dislike');

                //if has upvoted --> remove the like
                if(hasupVoted){
                    Users.findByIdAndUpdate({ _id: req.body.userID }, { $set: { upvotesPost: upvotesList } }, (err, success) => {
                        if (err) throw err;
                
                        if (!success) {
                            res.json({ success: false, msg: "failed to remove like" });
                        } else {
                            console.log('like removed-->adding dislike');
                        }
                    });
                }

                //already given a dislike--> remove the like
                if(hasdownVoted){
                    Users.findByIdAndUpdate({ _id: req.body.userID }, { $set: { downvotesPost: downvotesList } }, (err, success) => {
                        if (err) throw err;
                
                        if (!success) {
                            res.json({ success: false, msg: "failed to remove dislike" });
                        } else {
                            res.json({ success: true, msg: "dislike removed modfied" });
                        }
                    });
                }else{
                    //add the like
                    Users.findByIdAndUpdate({ _id: req.body.userID }, { $push: { downvotesPost: req.body._id } }, (err, success) => {
                        if (err) throw err;
                
                        if (!success) {
                            res.json({ success: false, msg: "dislike added" });
                        } else {
                            res.json({ success: true, msg: "dislike added" });
                        }
                    });
                }
            }
        }
    })

});


//update a post commetns
router.post("/post/comment", passport.authenticate('jwt', { session: false }), (req, res, next) => {

    console.log("################################################################");
    Comments.findOne({ content: req.body.content, postID: req.body.postID, username: req.body.username }, (err, comment) => {
        console.log("Found the comment");
        console.log(comment);
        if (comment) {
            Post.findOneAndUpdate({ _id: req.body.postID }, { $push: { comments: comment._id } }, (err, success) => {
                if (err) throw err;

                //if post was found(should find it always)
                if (success) {
                    return res.json({ msg: comment._id });

                } else {
                    console.log("No post found. Something went wrong...");
                    return res.json("failed to add comment to post");
                }

            });
        }
    });

});

//update a commetns of the user
router.post("/user/comment", passport.authenticate('jwt', { session: false }), (req, res, next) => {

    console.log("################################################################");


    Users.findOneAndUpdate({ _id: req.body.userID }, { $push: { comments: req.body.commentID } }, (err, success) => {
        if (err) throw err;

        //if post was found(should find it always)
        if (success) {
            return res.json('comment added to users');

        } else {
            console.log("No post found. Something went wrong...");
            return res.json("failed to add comment to users");
        }

    });



});
//update a comment 
router.post("/update/comment", passport.authenticate('jwt', { session: false }), (req, res, next) => {

    //get current date and time
    var currentDay = new Date();
    var updateDate = currentDay.getDate() + "/" + (currentDay.getMonth() + 1) + "/" + currentDay.getFullYear();
    var updateTime = currentDay.getHours() + ":" + currentDay.getMinutes();
    var fullUpdateTime = updateTime + " " + updateDate;

    //set new content
    Comments.findByIdAndUpdate({ _id: req.body._id }, { $set: { content: req.body.content, date: fullUpdateTime} }, (err, success) => {
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
    let updatedComments = [];
    


    //find the post and remove it from the post collection
    Post.findByIdAndRemove({ _id: req.body._id }, (err, success) => {

        //removed the post
        if(success){
            console.log('POST : post was deteled');
        }else{
            console.log('POST : post was NOT deleted');
            return res.json({success: false, msg:'POST : post was NOT deleted'});
        }
    });

    //remove the posts from the poster
    Users.findOne({ _id: req.body.userID }, (err, user) => {
            
        //found the user
        if (user) {
            let newUserposts = [];
            //find the post and set new array to users posts
            for (let i = 0; i < user.posts.length; i++) {
              
                if (user.posts[i] != req.body._id) {
                    newUserposts.push(user.posts[i]);
                }else{
                    console.log('post found');
                }
            }
            console.log('removing a post'+newUserposts);
            Users.findOneAndUpdate({ _id: req.body.userID }, { $set: { posts: newUserposts } }, (err, success) => {
                if (err) throw err;
                 //removed the post
                if(success){
                    console.log('USER : post was deleted');
                }else{
                    console.log('USER : post was NOT deleted');
                    return res.json({success: false, msg:'USER : post was NOT deleted'});
                }
            });
        }
    });


    //remove all post comments
    let commentsRemoved = [];
    Comments.find({}, (err, comments)=>{
        if(comments){
            //find the comments that need to be removed
            for(let i=0;i<comments.length;i++){

                //found a comment to be removed
                if(comments[i].postID == req.body._id){
                    commentsRemoved.push(comments[i]._id);
                }
            }

            //remove the comments
            for(let i=0; i<commentsRemoved.length;i++ ){
                Comments.findByIdAndRemove({_id: commentsRemoved[i]}, (err, success)=>{
                    if(success){
                        console.log('COMMENT : post was deleted');
                    }else{
                        console.log('COMMENT : post was NOT deleted');
                        return res.json({success: false, msg:'COMMENT : post was NOT deleted'});
                    }
                });
            }


            //remove the comments from users
    //first get all users and go through all of their comments and  if removed comment was round "remove" it
    Users.find({}, (err, users) =>{
        if(users){

            //all users
            for(let user = 0; user<users.length; user++){
                
                //list of all comments except the removed ones
                let newCommentList = [];
                let notToBeRemoved = false;
                let index = 0;
                //all single user comments
              
                for(let comment = 0; comment<users[user].comments.length;comment++){

                    //all comments to be removed
                    console.log("THIS MANY COMMENTS NEED TO BE REMOVED:"+commentsRemoved.length);
                    for(let id = 0; id<commentsRemoved.length;id++){

                        //not to be removed--> add to list
                        console.log(commentsRemoved[id],users[user].comments[comment]);
                        if(commentsRemoved[id] != users[user].comments[comment]){
                            console.log('ids not the same');
                            notToBeRemoved = true;
                            index = comment;
                        }else{
                            //found the removed-->go next
                            //https://stackoverflow.com/questions/3954438/how-to-remove-item-from-array-by-value
                            /*let index = commentsRemoved.indexOf(commentsRemoved[k]);
                            if (index !== -1) {
                                commentsRemoved.splice(index, 1);
                            }*/
                            notToBeRemoved = false;
                            break;
                        }
                    }

                    if(notToBeRemoved){
                      
                        newCommentList.push(users[user].comments[index]);
                    }
                    console.log(newCommentList);
                }

                
                //remove the comments from the user and go to next user
                Users.findOneAndUpdate({ _id: users[user]._id }, { $set: { comments: newCommentList } }, (err, success) => {
                    if (err) throw err;
                     //removed the post
                    if(success){
                        console.log('USER COMMENTS : comment was deleted');
                    }else{
                        console.log('USER COMMENTS: comment was NOT deleted');
                        return res.json({success: false, msg:'USER COMMENTS: comment was NOT deleted'});
                    }
                });
            }
        }
    });
        }
    });

    

    return   res.json({success: false, msg:'POST, COMMENT, USER, USER COMMENTS : post was deleted'});
});


//remove a comment
router.post("/remove/comment", (req, res, next) => {
    
    console.log("REMOVING A COMMENT");
    console.log(req.body);

    //remove comment from the comments db
   Comments.findByIdAndRemove({_id : req.body._id}, (err, success)=>{
        if(success){
            console.log('COMMENTS : comment was deteled');
        }else{
            console.log('COMMENTS : comment was NOT deleted');
            return res.json({success: false, msg:"COMMENTS : comment was NOT deleted"});
        }
    });

    //remove comment from the post db
    //first get all post comments and "remove" the comment
    Post.findOne({postID : req.body.postID}, (err, post)=>{
        if(post){

            //"remove" the comment from comments
            let commentIds = [];
            for(let i=0;i<post.comments.length;i++){
                //add all ids but the removed one
                if(post.comments[i] != req.body._id){
                    commentIds.push(post.comments[i]);
                }
            }

            //update the posts comment array
            Post.findByIdAndUpdate({ _id: req.body.postID }, { $set: { comments: commentIds } }, (err, success) => {
                if (err) throw err;
                if (success) {
                    console.log('POST : comment was deteled');
                }else{
                    console.log('POST : comment was NOT deleted');
                    return res.json({success: false, msg:"POST : comment was NOT deleted"});
                }
            });

        }
    });
    //remove comment from the user db
    //first get user that removed the comment and "remove" the comment
    Users.findById({_id: req.body.userID}, (err, user)=>{
        if(user){

            let commentIds = [];
            for(let i=0;i<user.comments.length;i++){
                //add all ids but the removed one
                if(user.comments[i] != req.body._id){
                    commentIds.push(user.comments[i]);
                }
            }

            //update the posts comment array
            Users.findByIdAndUpdate({ _id: req.body.userID }, { $set: { comments: commentIds } }, (err, success) => {
                if (err) throw err;
                if (success) {
                    console.log('USER : comment was deteled');
                }else{
                    console.log('USER : comment was NOT deleted');
                    return res.json({success: false, msg:"USER : comment was NOT deleted"});
                }
            });

        }
    })
    return res.json({success: true, msg:"Comment removed"});
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