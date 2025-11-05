const mongoose = require('mongoose');

// Define the schema for the objects in your array
const courseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    code:{
        type: String,
        required:true
    },
    instructor: {
        type: String,
        required: true
    },
    // Add other fields as needed
    description: {
        type: String,
        required:true
    }
});

// Create and export the model
module.exports = mongoose.model('course', courseSchema);