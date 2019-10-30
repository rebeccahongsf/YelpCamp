var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    Campground  = require("./models/campground"),
    Comment     = require("./models/comment"),
    seedDB      = require("./seeds");
const PORT = process.env.PORT || 3000;

seedDB(); // function invokation 
mongoose.connect("mongodb://localhost:27017/yelp_camp", { useNewUrlParser: true });
app.use(bodyParser.urlencoded({extend: true}));
app.set("view engine", "ejs");

app.get("/", function(req, res){
  res.render("landing");
})

// INDEX — Displays all campgrounds
app.get("/campgrounds", function(req, res){
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
app.get("/campgrounds/new", function(req, res){
  res.render("campgrounds/new");
}); 
  
// CREATE — Adds new campground                                                                    
app.post("/campgrounds", function(req, res){
  var name = req.body.name;
  var image = req.body.image;
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
app.get("/campgrounds/:id", function(req, res){
  // Find campground with provided ID
  Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
    if(err){
      console.log(err);
    } else {
      res.render("campgrounds/show",{campground: foundCampground});
    }
  });
});

// ==============
// Comment Routes
// ==============
app.get("/campgrounds/:id/comments/new", function(req, res){
  Campground.findById(req.params.id, function(err, campground){
    if(err){
      console.log(err);
    } else {
      res.render("comments/new", {campground: campground});
    }
  })
});

app.post("/campgrounds/:id/comments", function(req, res){
  // look up campgrounds using ID 
  Campground.findById(req.params.id, function(err, campground){
    if(err){
      console.log(err);
      res.redirect("/campgrounds");
    } else {
      Comment.create(req.body.comment, function(err, comment){
        if(err){
          console.log(err);
        } else {
          campground.comments.push(comment);
          campground.save();
          res.redirect("/campgrounds/" + campground._id);
        }
      });
    }
  })
  // create new comment
  // connect new comment to campgrounds
  // redirect to campground show page
});

app.listen(PORT, () => {
    console.log(`YelpCamp is running on port ${ PORT }`);
});
