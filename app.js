var express               = require("express"),
    app                   = express(),
    bodyParser            = require("body-parser"),
    passport              = require("passport"),
    mongoose              = require("mongoose"),
    Campground            = require("./models/campground"),
    Comment               = require("./models/comment"),
    User                  = require("./models/user"),
    LocalStrategy         = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose"),
    seedDB                = require("./seeds");
const PORT = process.env.PORT || 3000;

mongoose.connect("mongodb://localhost:27017/yelp_camp", { useNewUrlParser: true });
app.use(bodyParser.urlencoded({extend: true}));
app.use(express.static(__dirname + "/public"));
console.log(__dirname);
app.set("view engine", "ejs");
seedDB(); // function invokation 

// Passport Configuration
app.use(require("express-session")({
  secret: "Rusty is the best and cutest dog in the world",
  resave: false,
  saveUninitialized: false
}));
passport.use(new LocalStrategy(User.authenticate()));
app.use(passport.initialize());
app.use(passport.session());
// Uses the methods to encode and decode the data
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Middleware for currentUser status which will be called on every route.
app.use(function(req, res, next){
  res.locals.currentUser = req.user;
  next();
});

// Landing page
app.get("/", function(req, res){
  res.render("landing");
});

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
app.get("/campgrounds/:id/comments/new", isLoggedIn, function(req, res){
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


// ================
// Authentication Route
// ================
app.get("/register", function(req, res){
  res.render("register");
});

app.post("/register", function(req, res){
   newUser = new User({username: req.body.username});
   User.register(newUser, req.body.password, function(err, user){
     if(err){
       console.log(err);
       return res.render("register");
     }
     passport.authenticate("local")(req, res, function(){
       res.redirect("/campgrounds");
     })
   })
});


// ============
// Login Routes
// ============

// Show login form
app.get("/login", function(req, res){
  res.render("login");
});

app.post("/login", passport.authenticate("local",{
  // Middleware — code that runs before the callback
  successRedirect: "/campgrounds",
  failureRedirect: "/login"
}), function(req, res){
  
});

// ============
// Logout Routes
// ============
app.get("/logout", function(req, res){
  req.logout();
  res.redirect("/campgrounds");
});

// ============
// Is Logged In Check
// ============
function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  } 
  res.redirect("/login");
}

app.listen(PORT, () => {
    console.log(`YelpCamp is running on port ${ PORT }`);
});
