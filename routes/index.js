var express  = require("express");
var router   = express.Router();
var passport = require("passport");
var User     = require("../models/user");


// Landing page
router.get("/", function(req, res){
  res.render("landing");
});

// ================
// Register Route
// ================
router.get("/register", function(req, res){
  res.render("register");
});

router.post("/register", function(req, res){
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
router.get("/login", function(req, res){
  res.render("login", {message: req.flash("error")});
});

router.post("/login", passport.authenticate("local",{
  // Middleware — code that runs before the callback
  successRedirect: "/campgrounds",
  failureRedirect: "/login"
}), function(req, res){
  
});

// ============
// Logout Routes
// ============
router.get("/logout", function(req, res){
  req.logout();
  res.redirect("/campgrounds");
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
