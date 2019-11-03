var express     = require("express");
var router      = express.Router({mergeParams: true});
var Campground  = require("../models/campground");
var Comment     = require("../models/comment");

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
router.get("/new", isLoggedIn, function(req, res){
  res.render("campgrounds/new");
}); 
  
// CREATE — Adds new campground                                                                    
router.post("/", function(req, res){
  var name = req.body.name;
  var image = req.body.image;
  var desc = req.body.description;
  var newCampground = {name: name, image: image, description: description};
  
  // Create new campground and save to the DB 
  Campground.create(newCampground, function(err, campground){
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


// ===================
// Is Logged In Check
// ===================
function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  } 
  res.redirect("/login");
}

module.exports = router;
