'use strict';

// Imports
const express = require('express');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise();


// Module Imports
const {DATABASE_URL, PORT} = require('./config.js');


// Instantiation
const app = express();


// Server

let server;

function runServer(databaseUrl, port=PORT) {
    return new Promise( function(resolve, reject) {
        mongoose.connect(databaseUrl, { useNewUrlParser: true,  useUnifiedTopology: true }, function() {
            if (err) {
                return reject(err);
            }

            server = app.listen(port, function() {
                console.log(`Listening on port ${port}...`);
                resolve();
            })
            .on('error', function() {
                mongoose.disconnect();
                reject(err); 
            });
        });
    });
}  

server = app.listen('3000', function() {
    console.log('Your app is listening on port 3000...');
});