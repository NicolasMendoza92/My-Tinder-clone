const mongoose = require("mongoose");
const usersSchema = new mongoose.Schema({

    user_id: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    hashed_password: {
        type: String,
        required: true,
    },
    about: {
        type: String,
    },
    age: {
        type: Number,
    },
    dob_day: {
        type: String,
    },
    dob_month: {
        type: String,
    },
    dob_year: {
        type: String,
    },
    first_name: {
        type: String,
    },
    gender_identity: {
        type: String,
    },
    gender_interest: {
        type: String,
    },
    show_gender: {
        type: Boolean,
    },
    url: {
        type: String,
    },
    matches: {
        type: [String],  
        default: []     
    },
    register: {
        type: Date,
        default: Date.now(),
    },

});

module.exports = mongoose.model("User", usersSchema);