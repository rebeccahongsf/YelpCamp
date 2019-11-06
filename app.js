var express               = require("express"),
    app                   = express(),
    bodyParser            = require("body-parser"),
    passport              = require("passport"),
    mongoose              = require("mongoose"),
    flash                 = require("connect-flash"),
    methodOverride        = require("method-override"),
    Campground            = require("./models/campground"),
    Comment               = require("./models/comment"),
    User                  = require("./models/user"),
    LocalStrategy         = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose"),
    seedDB                = require("./seeds");
    
var commentRoutes         = require("./routes/comments"),
    campgroundRoutes     = require("./routes/campgrounds"),
    indexRoutes           = require("./routes/index");
    
const PORT = process.env.PORT || 3000;

mongoose.connect("mongodb://localhost:27017/yelp_camp", { useNewUrlParser: true });
// seedDB(); // function invokation 

app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({extend: true}));
app.use(express.static(__dirname + "/public"));
app.use(flash());

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

// Invoke Routes
app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(PORT, () => {
    console.log(`YelpCamp is running on port ${ PORT }`);
});
