var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var BidSchema = new Schema({
  uid: String,
  respondEmail: String,
  response: String,
  budgetResponse: String,
  req1Response: String,
  req2Response: String,
  req3Response: String
});

var Bid = mongoose.model('Bid', BidSchema);

module.exports = Bid;
