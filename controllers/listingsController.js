/************
 * DATABASE *
 ************/

 var db = require('../models');

 // GET /api/listings
function index (req, res) {
  db.Listing.find({}, function(err, allListings) {
    res.json(allListings);
  });
}

function create(req, res) {
  console.log('body', req.body);

  db.Listing.create(req.body, function(err, listing) {
    if (err) { console.log('error', err); }
    console.log(listing);
    res.json(listing);
  });
}

function show(req, res) {
  console.log(req.body);
  db.Listing.findById(req.params.listingId, function(err, foundListing) {
    if(err) { console.log('listingsController.show error', err); }
    console.log('listingsController.show responding with', foundListing);
    res.json(foundListing);
  });
}

function destroy(req, res) {
  db.Listing.findOneAndRemove({_id: req.params.listingId }, function(err, foundListing){
    res.json(foundListing);
  });
}

function update(req, res) {
  console.log('updating with data', req.body);
  db.Listing.findById(req.params.listingId, function(err, foundListing) {
    console.log(req.body);
    console.log(req.body.topic);
    console.log(foundListing);
    console.log(req.params.listingId);
    if(err) { console.log('listingsController.update error', err); }
    foundListing.topic = req.body.topic;
    foundListing.description = req.body.description;
    foundListing.budget = req.body.budget;
    foundListing.location = req.body.location;
    foundListing.save(function(err, savedListing) {
      if(err) { console.log('saving altered listing failed'); }
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
