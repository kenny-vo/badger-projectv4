var User = require('../models/user');
var auth = require('../resources/auth');


function signup(req, res) {
  User.findOne({ email: req.body.email }, function (err, existingUser) {
    if (existingUser) {
      return res.status(409).json({ message: 'Email is already taken.' });
    }

    if(err) {
      return res.json({err});
    }
    var user = new User({
      displayName: req.body.displayName,
      username: req.body.username,
      email: req.body.email,
      password: req.body.password
    });
    user.save(function (err, result) {
      if (err) {
        return res.status(500).json({ message: err.message });
      }
      return res.status(201).json({ token: auth.createJWT(result) });
    });
  });
}

function login(req, res) {
  User.findOne({ email: req.body.email }, '+password', function (err, user) {
    if (!user) {
      return res.status(401).send({ message: 'Invalid email or password.' });
    }
    user.comparePassword(req.body.password, function (err, isMatch) {
      if (!isMatch) {
        return res.status(401).send({ message: 'Invalid email or password.' });
      }
      res.send({ token: auth.createJWT(user) });
    });
  });
}

module.exports = {
  signup: signup,
  login: login
};
