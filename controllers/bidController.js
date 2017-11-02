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
    if (err) {
      console.log('Error:', err);
    }
    db.User.findOne({
      'listings._id': req.params.listingId
    }, function(err, foundUser) {
      if (err) {
        console.log('Error: ', err);
      }
      for (let i = 0; i < foundUser.listings.length; i++) {
        if (foundUser.listings[i]._id == req.params.listingId) {
          db.User.findById(req.user, function(err, currentUser) {
            console.log(currentUser)
            console.log('Found listing: ' + foundUser.listings[i].topic);
            let newBid = new db.Bid(req.body);
            newBid.uid = currentUser._id;
            newBid.responseEmail = currentUser.email;
            newBid.createdBy = foundUser.listings[i].createdBy;
            newBid.bidTopic = foundUser.listings[i].topic;
            setTimeout(function() {
              db.User.findById(req.user, function(err, currentUser) {
                console.log(currentUser.email)
                let newBid = new db.Bid(req.body);
                newBid.uid = currentUser._id;
                newBid.responseEmail = currentUser.email;
                newBid.createdBy = foundUser.listings[i].createdBy;
                newBid.bidTopic = foundUser.listings[i].topic;
                newBid.bidDescription = foundUser.listing[i].description;
                newBid.bidBudget = foundUser.listings[i].budget;
                currentUser.myBids.push(newBid);
                currentUser.save(function (err, savedUser) {
                  if (err) {
                    console.log('Error: ', err);
                    return;
                  }
                });
              });
            }, 1000);
            let oldLength = foundUser.listings[i].bids.length;
            foundUser.listings[i].bids.set(oldLength, newBid);
            foundUser.save(function(err, savedListing) {
              if (err) {
                console.log('Error: ', err);
                return;
              }
              res.json(newBid);
            });
          })
        }
      }
    })
  });
};

module.exports = {
  index: index,
  create: create
}
