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
     console.log(req.body);
     var newBid = new db.Bid(req.body);  // add data validation later
     foundListing.bids.push(newBid);
     foundListing.save(function(err, savedBid) {
       console.log('newBid created: ', newBid);
       res.json(newBid);  // responding with just the song, some APIs may respond with the parent object (Album in this case)
     });
   });
 }

 module.exports = {
   index: index,
   create: create
 }
