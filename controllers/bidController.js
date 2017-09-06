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
   db.User.findById(req.user, function (err, user) {
     if (err) {console.log(err);}
     db.Listing.findById(req.params.listingId, function(err, foundListing) {
       var newBid = new db.Bid(req.body);  // add data validation later
       newBid.uid = user._id
       foundListing.bids.push(newBid);
       foundListing.save(function(err, savedBid) {
         console.log('newBid created: ', newBid);
         res.json(newBid);
       });
     });
   });
 };

 module.exports = {
   index: index,
   create: create
 }
