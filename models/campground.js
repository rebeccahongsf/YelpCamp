var mongoose = require("mongoose");

// Schema Setup
var campgroundSchema = new mongoose.Schema({
  name: {
    type: String,
    required: "Campground name cannot be blank."
  },
  slug: {
    type: String,
    unique: true
  },
  image: String,
  price: String,
  description: String,
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    username: String
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment"
    }
  ]
});

var Campground = mongoose.model("Campground", campgroundSchema);
module.exports = Campground;
