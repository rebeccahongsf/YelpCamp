var mongoose = require("mongoose");
 
var commentSchema = new mongoose.Schema({
    text: String,
    author: {
      id: {
        type: mongoose.Schema.Types.ObjectID,
        ref: "User"
      },
      username: String
    }
});
 
var Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;
