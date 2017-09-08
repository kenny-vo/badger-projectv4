var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var BidSchema = new Schema({
  name: String,
  uid: String,
  respondEmail: String
});

var Bid = mongoose.model('Bid', BidSchema);

module.exports = Bid;
