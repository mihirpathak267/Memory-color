const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const XLSX = require('xlsx');
const fs = require('fs');
// const jsonData = require('./dat.json');

const mongoose = require('mongoose');



mongoose.connect('mongodb://127.0.0.1/memoryDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000, // wait up to 5 seconds for server selection
  socketTimeoutMS: 45000,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.log('MongoDB connection error:', err));
var age = '';
var gender = '';
var slider = '';
const number = Math.floor(Date.now() + Math.random());
console.log(number);
const responseSchema = new mongoose.Schema({
    
    stimuli: {
        type: String,
        required: true
    },
    question: {
      type: String,
      required: true
    },
    answer: {
      type: String,
      required: true
    }
  });
const userSchema = new mongoose.Schema({
    uid: Number,
    age: String,
    gender: String,
    slider: {
        type: String,
        required: true
    },
    responses: [responseSchema]
})
const User = new mongoose.model('User', userSchema);

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
app.get("/ins", (req,res)=>{
    res.render("instruction");
})
app.post("/form", (req, res)=>{
    res.render("userform");
})
app.post("/user", (req, res)=>{
    console.log(req.body);
    age = req.body.age;
    gender = req.body.gender;
    res.redirect('slider');
    
})
app.post('/userslider', (req,res)=>{
    console.log(req.body)
    slider = req.body.sliderRGB.substring(4,13)
    res.redirect("change")
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

    res.render("change", {stimuliTitle: sequence[inde], color: color});
    inde+=1;
    }
    else {
        res.redirect("finish");
    }
})
app.get("/finish", function (req, res){
    // const workbook = XLSX.utils.book_new();
    // const worksheet = XLSX.utils.json_to_sheet(dataArray);
    // XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    // XLSX.writeFile(workbook, "data.xlsx");
    const newUser = new User({
        uid: number,
        age: age,
        gender: gender,
        slider: slider,
        responses: dataArray
    })
    console.log(newUser);
    // newUser.save((err)=>console.log(err));


    res.render("finish")
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
            question: questionRGB,
            answer: answerRGB
        }
    )
    console.log(dataArray);
    
    res.redirect('/change');
})
// User.findOne({uid:1679672785665})
// .then((user)=>console.log(user))
// .catch(err=>console.log(err));
app.get("/data",(req,res)=>{
    User.find({})
    .then(user=>console.log(user))
    .catch(err=>console.log(err));
    // mongoexport --db memoryDB --collection users --out dat.json
})
app.get("/generate",(req, res)=>{
    generateExcel()
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
function generateExcel(){
  
  // initialize an empty worksheet
const worksheet = XLSX.utils.json_to_sheet([]);

// create an empty array to store data
let data = [];

// loop through each object in jsonData
for (let i = 0; i < jsonData.length; i++) {
  const obj = jsonData[i];
  const uid = obj.uid;
  const age = obj.age;
  const gender = obj.gender;
  const slider = obj.slider;

  // loop through each response object
  for (let j = 0; j < obj.responses.length; j++) {
    const response = obj.responses[j];
    const stimuli = response.stimuli;
    const question = response.question;
    const answer = response.answer;

    // create a new object for each row of data
    const row = {
      uid: j === 0 ? uid : '',
      age: j === 0 ? age : '',
      gender: j === 0 ? gender : '',
      slider: j === 0 ? slider : '',
      stimuli: stimuli,
      question: question,
      answer: answer
    };

    // add the row to the data array
    data.push(row);
  }
}

// add the data to the worksheet
XLSX.utils.sheet_add_json(worksheet, data, {skipHeader: true, origin: 'A2'});

// set up the headers
const headers = ["UID", "Age", "Gender", "Slider", "Stimuli", "Question", "Answer"];
XLSX.utils.sheet_add_aoa(worksheet, [headers], {origin: 'A1'});

// create a new workbook and add the worksheet to it
const workbook = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

// write the workbook to a file
XLSX.writeFile(workbook, 'data3.xlsx');  
    
console.log("succesfully generated the excel file");
}