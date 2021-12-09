//get mongoose
const mongoose = require("mongoose");

//get schema
const Schema = mongoose.Schema;

//post schema
const postShema = new Schema({
    userID: { //user id of the writer
        type: String
    },
    username: { //username of the writer of the post
        type: String
    },
    title: { //title of the post
        type: String,
        required: true
    },
    content: { //content of the post
        type: String,
        required: true
    },
    date: {
        type: String //date
    },
    comments: {
        type: Array //comment id
    },
    upvotes: {
        type: Array //up votes ids
    },
    downvotes: {
        type: Array //down votes ids
    }
});

//export
module.exports = mongoose.model('Post', postShema);