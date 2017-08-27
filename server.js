"use strict";

// require express and other modules
var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    hbs = require('hbs'),
    mongoose = require('mongoose'),
    auth = require('./resources/auth'),
    controllers = require('./controllers');

// require and load dotenv
require('dotenv').load();

// serve static files from public folder
app.use(express.static(__dirname + '/public'));
// configure bodyParser (for receiving form data)
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


// set view engine to hbs (handlebars)
app.set('view engine', 'hbs');

// connect to mongodb
mongoose.connect('mongodb://localhost/identifly');

// require User and Post models
var User = require('./models/user');
var Listing = require('./models/listing');


/*
 * API Routes
 */

 app.get('/api', controllers.api.index);

 // Listings
 app.get('/api/listings', controllers.listings.index);
 app.get('/api/listings/:listingId', controllers.listings.show);
 app.post('/api/listings', auth.ensureAuthenticated, controllers.listings.create);
 app.delete('/api/listings/:listingId', auth.ensureAuthenticated, controllers.listings.destroy);
 app.put('/api/listings/:listingId', auth.ensureAuthenticated, controllers.listings.update);

//  Profile

app.get('/api/users', function (req, res) {
  User.find({}, function (err, user) {
    res.json(user);
  });
});

app.get('/api/users/:_id', function (req, res) {
  User.findById(req.params._id, function (err, foundUser) {
    if(err) {console.log(err);}
    res.json(foundUser);
  });
});



app.get('/api/me', auth.ensureAuthenticated, function (req, res) {
  User.findById(req.user, function (err, user) {
    res.send(user.populate('posts'));
  });
});

app.put('/api/me', auth.ensureAuthenticated, function (req, res) {
  User.findById(req.user, function (err, user) {
    if (!user) {
      return res.status(400).send({ message: 'User not found.' });
    }
    user.displayName = req.body.displayName || user.displayName;
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;
    user.save(function(err) {
      res.send(user.populate('listings'));
    });
  });
});


/*
 * Auth Routes
 */

 app.post('/auth/signup', controllers.users.signup);
 app.post('/auth/login', controllers.users.login);


/*
 * Catch All Route
 */
app.get('*', function (req, res) {
  res.render('index');
});


/*
 * Listen on localhost:3000
 */
 app.listen(process.env.PORT || 9000, function () {
   console.log('Express server is running on port ' + (process.env.PORT || 9000));
 });
