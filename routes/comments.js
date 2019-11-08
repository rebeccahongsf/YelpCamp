var express     = require("express");
var router      = express.Router({mergeParams: true});
var Campground  = require("../models/campground");
var Comment     = require("../models/comment");
var middleware  = require("../middleware");

// ==============
// Comment Routes
// ==============
router.get("/new", middleware.isLoggedIn, function(req, res){
  Campground.findById(req.params.id, function(err, campground){
    if(err){
      req.flash("error", "Something went wrong...");
      res.redirect("back");
    } else {
      res.render("comments/new", {campground: campground});
    }
  });
});

router.post("/", function(req, res){
  // look up campgrounds using ID 
  Campground.findById(req.params.id, function(err, campground){
    if(err){
      req.flash("error", "Something went wrong...");
      res.redirect("/campgrounds");
    } else {
      Comment.create(req.body.comment, function(err, comment){
        if(err){
          req.flash("error", "Something went wrong...");
        } else {
          // add username and ID to comment
          comment.author.id = req.user.id;
          comment.author.username = req.user.username;
          // save comment
          comment.save();
          
          campground.comments.push(comment);
          campground.save();
          console.log(comment);
          req.flash("success", "Successfully added comment.");
          res.redirect("/campgrounds/" + campground._id);
        }
      });
    }
  })
});

// Edit Comment
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
  Comment.findById(req.params.comment_id, function(err, foundComment){
    if(err){
      req.flash("error", "You do not have permissions to edit this comment.");
    } else {
      res.render("comments/edit", {campground_id: req.params.id, comment: foundComment} );
    }
  });
});

// Update Comment
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
    if(err){
      req.flash("error", "Something went wrong...");
      res.redirect("back");
    } else {
      req.flash("success", "Successfully updated comment!");
      res.redirect("/campgrounds/" + req.params.id);
    }
  })
});

// Delete Comment
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
  Comment.findByIdAndRemove(req.params.comment_id, function(err){
    if(err){
      res.redirect("back");
    } else {
      req.flash("success", "Successfully deleted comment!");
      res.redirect("/campgrounds/" + req.params.id );
    }
  });
});

module.exports = router;
