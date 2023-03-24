const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const XLSX = require('xlsx');

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", function(req, res){
    res.render("start");
});

app.post("/", function(req, res){
    console.log(req.body.rgbColor);
});
app.post("/form", (req, res)=>{
    res.render("userform");
})
app.get("/slider", (req,res)=>{
    res.render("slider");
})
const defaultArray = ["bs", "rs","bc","rc"];
const count = 30;
let sequence = [];
for (let i = 0; i < defaultArray.length; i++) {
  for (let j = 0; j < count; j++) {
    sequence.push(defaultArray[i]);
  }
}

// Shuffle the sequence using the Fisher-Yates algorithm
for (let i = sequence.length - 1; i > 0; i--) {
  const j = Math.floor(Math.random() * (i + 1));
  [sequence[i], sequence[j]] = [sequence[j], sequence[i]];
}
console.log(sequence);



var question = 0;
var inde = 0;   
var dataArray = [];
// make a get route for the change ejs file that randomly changes the stimuli shown
app.get("/change", function(req, res){
    
    // var change = Math.floor(Math.random()*4);
    // var stimuli = defaultArray[change];
    let color = colorGenerator();
    
    if (question<12){
    question+=1;

    res.render("change", {stimuliTitle: sequence[inde], color: color, question:question});
    inde+=1;
    }
    else {
        res.render("finish");
    }
})
app.get("/finish", function (req, res){
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(dataArray);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, "data.xlsx");
})
app.post("/change", (req,res)=>{
    console.log(req.body)
    const stimuli = req.body.stimuli;
    const questionRGB = req.body.qrgbColor.substring(4,13);
    var answerRGB = req.body.rgbColor;
    if (answerRGB[0]==='r'){
        answerRGB = answerRGB.substring(4,13);
    }
    
    dataArray.push(
        {
            stimuli: stimuli,
            questionRGB: questionRGB,
            answerRGB: answerRGB
        }
    )
    console.log(dataArray);
    
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