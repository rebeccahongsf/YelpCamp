var express = require("express");
var app = express();
var bodyParser = require("body-parser");

const PORT = process.env.PORT || 3000;

var campgrounds = [
  {name:"Salmon Creek", image: "https://images.unsplash.com/photo-1533873984035-25970ab07461?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1653&q=80"},
  {name:"Granite Hill", image: "https://images.unsplash.com/photo-1520824071669-892f70d8a23d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1597&q=80"},
  {name:"Goat Rest", image: "https://images.unsplash.com/photo-1475092432448-fe76c45a8d6d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1951&q=80"},
  {name:"Trout Bay", image: "https://images.unsplash.com/photo-1415545726807-720597b0d497?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"}
]

app.use(bodyParser.urlencoded({extend: true}));
app.set("view engine", "ejs");

app.get("/", function(req, res){
  res.render("landing");
})

app.get("/campgrounds", function(req, res){
  res.render("campgrounds", {campgrounds: campgrounds});
})

app.get("/campgrounds/new", function(req, res){
  res.render("new");
});                                                                          
app.post("/campgrounds", function(req, res){
  var name = req.body.name;
  var image = req.body.image;
  var newCampground = {name: name, image: image};
  campgrounds.push(newCampground);
  res.redirect("/campgrounds");
});


app.listen(PORT, () => {
    console.log(`YelpCamp is running on port ${ PORT }`);
});
