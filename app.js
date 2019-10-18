var express = require("express");
var app = express();
var bodyParser = require("body-parser");

const PORT = process.env.PORT || 3000;

var campgrounds = [
  {name:"Salmon Creek", image: "https://www.photosforclass.com/download/pixabay-1149402?webUrl=https%3A%2F%2Fpixabay.com%2Fget%2F57e1d14a4e52ae14f6da8c7dda793f7f1636dfe2564c704c722e78d59245c158_960.jpg&user=Free-Photos"},
  {name:"Granite Hill", image: "https://www.photosforclass.com/download/pixabay-3616194?webUrl=https%3A%2F%2Fpixabay.com%2Fget%2F55e6d4454b5ba814f6da8c7dda793f7f1636dfe2564c704c722e78d1904bc25f_960.jpg&user=Schwoaze"},
  {name:"Goat Rest", image: "https://www.photosforclass.com/download/pixabay-1189929?webUrl=https%3A%2F%2Fpixabay.com%2Fget%2F57e1dd4a4350a514f6da8c7dda793f7f1636dfe2564c704c722e78d59245c158_960.jpg&user=Noel_Bauza"},
  {name:"Trout Bay", image: "https://www.photosforclass.com/download/pixabay-1851092?webUrl=https%3A%2F%2Fpixabay.com%2Fget%2F57e8d0424a5bae14f6da8c7dda793f7f1636dfe2564c704c722e78d59245c158_960.jpg&user=Pexels"},
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
