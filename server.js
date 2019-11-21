'use strict';

// Imports
const express = require('express');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise();

// Instantiation
const app = express();





// Server

let server;

server = app.listen('3000', function() {
    console.log('Your app is listening on port 3000...');
});