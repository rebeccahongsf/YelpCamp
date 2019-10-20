var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose");
const PORT = process.env.PORT || 3000;

mongoose.connect("mongodb://localhost:27017/yelp_camp", { useNewUrlParser: true });
app.use(bodyParser.urlencoded({extend: true}));
app.set("view engine", "ejs");

// Schema Setup
var campgroundSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String
});

var Campground = mongoose.model("Campground", campgroundSchema);

// Campground.create({
//   name: "Granite Hill",
//   image: "https://images.unsplash.com/photo-1558552709-7c68bf76b9ab?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2250&q=80",
//   description: "Beautiful medow on a hill with a clear lake in view."
// }, function(err, campground){
//   if(err){
//     console.log(err);
//   } else {
//     console.log(campground);
//   }
// });


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
      res.render("index", {campgrounds: allCampgrounds});
    }
  });
});

// NEW — Displays form to add campground
app.get("/campgrounds/new", function(req, res){
  res.render("new");
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
  Campground.findById(req.params.id, function(err, foundCampground){
    if(err){
      console.log(err);
    } else {
      res.render("show",{campground: foundCampground});
    }
  });
});

app.listen(PORT, () => {
    console.log(`YelpCamp is running on port ${ PORT }`);
});
