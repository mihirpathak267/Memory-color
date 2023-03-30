const mongoose = require('mongoose');

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

module.exports = User;