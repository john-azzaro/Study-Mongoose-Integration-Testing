"use strict";

// Imports
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

// Schemas
const restaurantSchema = mongoose.Schema({
  name: { type: String, required: true },
  borough: { type: String, required: true },
  cuisine: { type: String, required: true },
  address: {
      building: String,
      coord: [String],
      street: String,
      zipcode: String
  },
  grades: [
      {
      date: Date,
      grade: String,
      score: Number
      }
  ]
});

// Virtuals
restaurantSchema.virtual('addressString').get(function() {
  return `${this.address.building} ${this.address.street}`.trim();
});

restaurantSchema.virtual("grade").get(function() {
  const gradeObj =
    this.grades.sort((a, b) => {
      return b.date - a.date;
    })[0] || {};
  return gradeObj.grade;
});

// Instance methods


// Models
const Restaurant = mongoose.model("Restaurant", restaurantSchema);

// Exported Models
module.exports = { Restaurant }