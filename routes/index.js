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
  res.render("login");
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
  req.flash("success", "You have been logged out!");
  res.redirect("/campgrounds");
});

module.exports = router;
