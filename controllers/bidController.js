/************
 * DATABASE *
 ************/

var db = require('../models');

function index(req, res) {
  db.Listing.findById(req.params.listingId, function(err, foundListing) {
    console.log('responses:', foundListing.bids);
    res.json(foundListing.bids);
  });
}

function create(req, res) {
  db.Listing.findById(req.params.listingId, function(err, foundListing) {
    // console.log(foundListing._id );
    if (err) {
      console.log('Error', err);
    }
    // res.json(foundListing);
    // get array of all users
    db.User.find({}, function(err, users) {
      // for loop iterates through all users' listings
      for (let i = 0; i < users.length; i++) {
        let listings = users[i].listings
        // for loop iterates through all listings ids
        for (let j = 0; j < listings.length; j++) {
          // finds match
          // comparing _id with _id returning false. Not sure why, will return later
          if (listings[j].topic === foundListing.topic && listings[j].created === foundListing.created) {
            console.log("Found match: " + foundListing.topic);
            // get current user id to add to bid object
            db.User.findById(req.user, function(err, user) {
              if (err) {
                console.log(err);
              }
              var newBid = new db.Bid(req.body); // add data validation later
              newBid.uid = user._id
              // pushes new bid object into embedded listing
              users[i].listings[j].bids.push(newBid);
              users[i].listings[j].save(function(err, savedBid) {
                console.log('newBid created: ', newBid);
                console.log(users[i].listings[j]);
                res.json(newBid);
              });
            });
          }
        }
      }
    })
    if (err) {
      console.log(err);
    }
  });
};

module.exports = {
  index: index,
  create: create
}
