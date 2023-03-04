const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const exerciseSchema = new Schema({
    email: {
        type: String
    },
    data: [
        {
            date: {
                type: String
            },
            exercise: {
                type: String
            },
            repetitions:[Number],
            weight: [Number]
        }
    ]
   
    
})

const Exercise = mongoose.model('Exercise', exerciseSchema);
module.exports = Exercise;


