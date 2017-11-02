var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var BidSchema = new Schema({
  uid: String,
  createdBy: String,
  responseEmail: String,
  bidTopic: String,
  bidDescription: String,
  bidBudget: String,
  bidLocation: String,
  response: String,
  responseDate: String,
  budgetResponse: String,
  req1Response: String,
  req2Response: String,
  req3Response: String
});

BidSchema.pre('save', function(next) {
  now = new Date().toLocaleDateString('en-US');
  if (!this.responseDate)
    this.responseDate = now;

  next();
});

var Bid = mongoose.model('Bid', BidSchema);

module.exports = Bid;
