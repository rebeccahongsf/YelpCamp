// Middleware 
var Campground  = require("../models/campground");
var Comment     = require("../models/comment");

var middlewareObj = {};

// ===================
// Is Logged In Check
// ===================
middlewareObj.isLoggedIn = function(req, res, next) {
  if(req.isAuthenticated()){
    return next();
  } 
  req.flash("error", "Please Login First!");
  res.redirect("/login");
}

// ========================
// Comment Ownership Check
// ========================
middlewareObj.checkCommentOwnership = function(req, res, next) {
  if(req.isAuthenticated()){
    Comment.findById(req.params.comment_id, function(err, foundComment){
      if(err){
        console.log(err);
        res.redirect("back");
      } else {
        if(foundComment.author.id.equals(req.user._id)){
          next();
        } else {
          res.redirect("back");
        }
      }
    });
  } else {
    res.redirect("back");
  }
}

// ===========================
// Campground Ownership Check
// ===========================
middlewareObj.checkCampgroundOwnership = function(req, res, next) {
  if(req.isAuthenticated()){
    Campground.findById(req.params.id, function(err, foundCampground){
      if(err){
        console.log(err);
        res.redirect("back");
      } else {
        if(foundCampground.author.id.equals(req.user._id)){
          next();
        } else {
          res.redirect("back");
        }
      }
    });
  } else {
    res.redirect("back");
  }
}

module.exports = middlewareObj
