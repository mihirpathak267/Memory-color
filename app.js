const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const XLSX = require('xlsx');

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
const defaultArray = ["bs", "rs","bc","rc"];


var question = 0;

// make a get route for the change ejs file that randomly changes the stimuli shown
app.get("/change", function(req, res){
    
    var change = Math.floor(Math.random()*4);
    var stimuli = defaultArray[change];
    let color = colorGenerator();
    
    if (question<=120){
    question+=1;
    res.render("change", {stimuliTitle: stimuli, color: color, question:question});
    
    }
})
app.post("/change", (req,res)=>{
    console.log(req.body)
    
    res.redirect('/change');
})

app.listen(4000, function(req, res){
    console.log("Server is listening on port 4000");
});
function colorGenerator(){
    var r = 255;
    var g = 159 + Math.floor(Math.random()*96);
    var b = 0;
    var generatedColor = "rgb(" + r + "," + g + "," + b + ")";
    return generatedColor
}