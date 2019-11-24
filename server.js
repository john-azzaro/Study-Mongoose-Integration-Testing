'use strict';

// Imports
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
mongoose.Promise = global.Promise;


// Module Imports (from config.js)
const {DATABASE_URL, PORT} = require('./config.js');
const { Restaurant } = require("./models.js")


// Initialize app
const app = express();


// Middleware
app.use(express.json());
app.use(morgan('common'));

// Routes
app.get('/restaurants', (req, res) => {
   Restaurant
      .find()
      .limit(10)  
      .then(restaurants => {
         res.json({
            restaurants: restaurants.map(
            (restaurant) => restaurant.serialize())
         });
      })
      .catch(err => {
         console.error(err);
         res.status(500).json({ message: 'Internal server error' });
      });
});


app.get('/restaurants/:id', (req, res) => {
   Restaurant
   .findById(req.params.id)
   .then(restaurant => res.json(restaurant.serialize()))
   .catch(err => {
   console.error(err);
   res.status(500).json({ message: 'Internal server error' });
   });
});


app.post('/restaurants', (req, res) => {
   const requiredFields = ['name', 'borough', 'cuisine'];
   for (let i = 0; i < requiredFields.length; i++) {
       const field = requiredFields[i];
       if (!(field in req.body)) {
       const message = `Missing \`${field}\` in request body`;
       console.error(message);
       return res.status(400).send(message);
       }
   }

   Restaurant
       .create({
       name: req.body.name,
       borough: req.body.borough,
       cuisine: req.body.cuisine,
       grades: req.body.grades,
       address: req.body.address
       })
       .then(restaurant => res.status(201).json(restaurant.serialize()))
       .catch(err => {
       console.error(err);
       res.status(500).json({ message: 'Internal server error' });
       });
});


app.put('/restaurants/:id', (req, res) => {
   if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
      const message = (
      `Request path id (${req.params.id}) and request body id ` +
      `(${req.body.id}) must match`);
      console.error(message);
      return res.status(400).json({ message: message });
  }

  const toUpdate = {};
  const updateableFields = ['name', 'borough', 'cuisine', 'address'];

  updateableFields.forEach(field => {
      if (field in req.body) {
      toUpdate[field] = req.body[field];
      }
  });

  Restaurant
      .findByIdAndUpdate(req.params.id, { $set: toUpdate })
      .then(restaurant => res.status(204).end())
      .catch(err => res.status(500).json({ message: 'Internal server error' }));
});


app.delete('restaurants/:id', (req, res) => {
   Restaurant
      .findByIdAndRemove(req.params.id)
      .then(restaurant => res.status(204).end())
      .catch(err => res.status(500).json({ message: 'Internal server error' }));
});






// Server
let server;

function runServer(databaseUrl, port = PORT) {
    return new Promise(function(resolve, reject) {
       mongoose.connect(databaseUrl, { useNewUrlParser: true, useUnifiedTopology: true }, function(err) {
          if (err) {
             return reject(err);
          }
 
          server = app
             .listen(port, function() {
                console.log(`Listening on port ${port}...`);
                resolve();
             })
 
             .on('error', function(err) {
                mongoose.disconnect();
                reject(err);
             });
       });
    });
}

function closeServer() {
    return mongoose.disconnect().then(function() {
       return new Promise(function(resolve, reject) {
          console.log('Closing server');
          server.close(function(err) {
             if (err) {
                return reject(err);
             }
             resolve();
          });
       });
    });
 }

if (require.main === module) { 
    runServer(DATABASE_URL).catch(err => console.error(err));
}