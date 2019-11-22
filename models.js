"use strict";

// Imports
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

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

const Restaurant = mongoose.model("Restaurant", restaurantSchema);