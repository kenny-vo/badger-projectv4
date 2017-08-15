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
var Post = require('./models/post');


/*
 * API Routes
 */

 app.get('/api', controllers.api.index);

 app.get('/api/listings', controllers.listings.index);
 app.get('/api/listings/:listingId', controllers.listings.show);
 app.post('/api/listings', controllers.listings.create);
 app.delete('/api/listings/:listingId', controllers.listings.destroy);
 app.put('/api/listings/:listingId', controllers.listings.update);


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
      res.send(user.populate('posts'));
    });
  });
});


app.post('/api/posts', auth.ensureAuthenticated, function (req, res) {
  User.findById(req.user, function (err, user) {
    var newPost = new Post(req.body);
    newPost.save(function (err, savedPost) {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        user.posts.push(newPost);
        user.save();
        res.json(savedPost);
      }
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
   console.log('Express server is running on http://localhost:3000/');
 });
