//get mongoose
const mongoose = require("mongoose");

//get schema
const Schema = mongoose.Schema;

//user schema
const userShema = new Schema({
    name: { //name of the user
        type: String
    },
    email: { //email of the user
        type: String,
        required: true
    },
    username: { //username of the user
        type: String,
        required: true
    },
    password: { //password of the user
        type: String,
        required: true
    },
    posts: { //all post ids of the user posts
        type: Array
    },
    comments: { //all comment ids of the user posts 
        type: Array
    },
    bio: { //bio of the user
        type: String
    },
    registerdate: { //register date of the user
        type: String
    },
    upvotesPost: {
        type: Array //up votes ids
    },
    downvotesPost: {
        type: Array //down votes ids
    },
    upvotesComments: {
        type: Array //up votes ids
    },
    downvotesComments: {
        type: Array //down votes ids
    },
    admin: {
        type: Boolean //true if admin user
    }
});

//export
module.exports = mongoose.model('User', userShema);