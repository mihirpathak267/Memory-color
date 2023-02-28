const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", function(req, res){
    res.render("home");
});

app.post("/", function(req, res){
    console.log(req.body.rgbColor);
});
const defaultArray = ["banana", "rectangle"];
// make a get route for the change ejs file that randomly changes the stimuli shown
app.get("/change", function(req, res){
    var change = Math.floor(Math.random()*2);
    var stimuli = defaultArray[change];
    res.render("change", {stimuliTitle: stimuli});
})

app.listen(4000, function(req, res){
    console.log("Server is listening on port 4000");
});