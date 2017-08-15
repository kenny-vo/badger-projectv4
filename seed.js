var db = require("./models");

var listingList = [];

listingList.push({
        topic: "Test",
        description: "Test",
        budget: "Test",
        location: "Test",
        req1: "Test",
        req2: "Test",
        req3: "Test",
        date: "Test",
        date_req: "Test"
      });
listingList.push({
        topic: "Test",
        description: "Test",
        budget: "Test",
        location: "Test",
        req1: "Test",
        req2: "Test",
        req3: "Test",
        date: "Test",
        date_req: "Test"
      });


db.Listing.remove({}, function(err, listings){

  db.Listing.create(listingList, function(err, listings){
    if (err) { return console.log('Error', err); }
    console.log("all listings", listings);
    console.log("created", listings.length, "listings");
    process.exit();
  });
});
