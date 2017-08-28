var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var Bid = require('./bid');

var ListingSchema = new Schema({
  topic: String,
  description: String,
  budget: String,
  location: String,
  req1: String,
  req2: String,
  req3: String,
  created: String,
  dateReq: String,
  uid: String,
  bids: [Bid.schema]
})

ListingSchema.pre('save', function(next) {
  now = new Date().toLocaleDateString('en-US');
  if (!this.created)
    this.created = now;

  next();
});

var Listing = mongoose.model('Listing', ListingSchema);

module.exports = Listing;
