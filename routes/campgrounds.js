var express     = require("express");
var router      = express.Router({mergeParams: true});
var Campground  = require("../models/campground");
var Comment     = require("../models/comment");
var middleware  = require("../middleware");

// INDEX — Displays all campgrounds
router.get("/", function(req, res){
  // Get all campgrounds from DB 
  Campground.find({}, function(err, allCampgrounds){
    if(err){
      console.log(err);
    } else {
      res.render("campgrounds/index", {campgrounds: allCampgrounds});
    }
  });
});

// NEW — Displays form to add campground
router.get("/new", middleware.isLoggedIn, function(req, res){
  res.render("campgrounds/new");
}); 
  
// CREATE — Adds new campground                                                                    
router.post("/", middleware.isLoggedIn, function(req, res){
  var name = req.body.name;
  var image = req.body.image;
  var description = req.body.description;
  var author = {
    id: req.user._id,
    username: req.user.username
  }
  var newCampground = {name: name, image: image, description: description, author: author};
  // Create new campground and save to the DB 
  Campground.create(newCampground, function(err, newlyCreated){
    if(err){
      console.log(err);
    } else {
      // Redirect
      res.redirect("/campgrounds");
    }
  });
});

// SHOW — Displays information of one campground
router.get("/:id", function(req, res){
  // Find campground with provided ID
  Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
    if(err){
      console.log(err);
    } else {
        res.render("campgrounds/show",{campground: foundCampground});
    }
  });
});

// EDIT
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
  Campground.findById(req.params.id, function(err, foundCampground){
    if(err) {
      req.flash("error", "Campgorund does not exist!");
      res.redirect("back");
    } else {
      res.render("campgrounds/edit", {campground: foundCampground});
    }
  });
});

// UPDATE 
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
  // find and update the correct campgrounds
  var data = {name: req.body.name, image: req.body.image, description: req.body.description};
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
    if(err){
      req.flash("error", "You do not have permission to do that!");
      res.redirect("/campgrounds/:id");
    } else {
      req.flash("success", "Campground has been updated!");
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});

// DESTORY
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
  Campground.findByIdAndRemove(req.params.id, function(err){
    if(err){
      req.flash("error", "You do not have permission to do that!");
      res.redirect("/campgrounds");
    } else {
      req.flash("success", "Campground has been deleted!");
      res.redirect("/campgrounds");
    }
  });
})

module.exports = router;
