//get mongoose
const mongoose = require("mongoose");

//get schema
const Schema = mongoose.Schema;

//post schema
const commentSchema = new Schema({
    userID: { //user id of the commenter
        type: String
    },
    username: { //username of the commenter
        type: String
    },
    postID: { //post id where the comment is
        type: String
    },
    content: { //content of the comment
        type: String,
        required: true
    },
    date: { //last time edited the comment
        type: String
    },

});

//export
module.exports = mongoose.model('Comment', commentSchema);