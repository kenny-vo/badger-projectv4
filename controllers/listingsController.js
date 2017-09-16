/************
 * DATABASE *
 ************/

var db = require('../models');

// GET
function index(req, res) {
  db.User.findById(req.user, function(err, user) {
    if (err) {
      res.json(err);
    }

    db.Listing.find({}, function(err, allListings) {
      res.json(allListings);
      console.log("here")
    });
  })
}

function create(req, res) {
  db.User.findById(req.user, function(err, user) {
    console.log(req.user)
    if (err) {
      console.log(err);
    }
    var newListing = new db.Listing(req.body);
    newListing.uid = user._id
    newListing.save(function(err, savedListing) {
      if (err) {
        res.status(500).json({error: err.message});
      } else {
        user.listings.push(newListing);
        user.save();
        res.json(savedListing);
      }
    });
  });
};
function show(req, res) {
    db.Listing.findById(req.params.listingId, function(err, foundListing) {
      if(err) { console.log('listingsController.show error', err); }
     res.json(foundListing);

  });
}


// function show(req, res) {
//   db.User.findById(req.user, function(err, user) {
//     let pertinentListing = user.listings.find(function filter(element) {
//       return element._id.toString() === req.params.listingId;
//     });
//
//     if (err) {
//       console.log('listingsController.show error', err);
//     }
//     res.json(pertinentListing);
//   });
// }

function destroy(req, res) {
  db.Listing.findOneAndRemove({
    _id: req.params.listingId
  }, function(err, foundListing) {})
  console.log('req.user is ', req.user);

  db.User.findById(req.user, function(err, user) {
    if (err) {
      console.log('Error finding a user when trying to delete a record.');
      res.json(err);
    }

    user.listings = user.listings.filter(function(element) {
      return element._id.toString() !== req.params.listingId;
    });

    user.save(function(err, savedListing) {
      if (err) {
        console.log('saving altered listing failed');
      }
      res.json(savedListing);
    });
  });
}

function update(req, res) {
  db.Listing.findById(req.params.listingId, function(err, foundListing) {
    if (err) {
      console.log('listingsController.update error', err);
    }
    foundListing.topic = req.body.topic;
    foundListing.description = req.body.description;
    foundListing.budget = req.body.budget;
    foundListing.location = req.body.location;
    foundListing.save(function(err, savedListing) {
      if (err) {
        console.log('saving altered listing failed');
      }
      res.json(savedListing);
    });
  });

}

module.exports = {
  index: index,
  create: create,
  show: show,
  destroy: destroy,
  update: update
};
