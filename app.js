const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const XLSX = require('xlsx');

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
    
    if (question<3){
    question+=1;

    res.render("change", {stimuliTitle: sequence[inde], color: color, question:question});
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
    newUser.save((err)=>console.log(err));


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
