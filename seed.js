var db = require("./models");

var listingList = [];

listingList.push({
        topic: "Test01",
        description: "Test01",
        budget: "Test01",
        location: "Test01",
        req1: "Test01",
        req2: "Test01",
        req3: "Test01",
        date: "Test01",
        date_req: "Test01"
      });
listingList.push({
        topic: "Test02",
        description: "Test02",
        budget: "Test02",
        location: "Test02",
        req1: "Test02",
        req2: "Test02",
        req3: "Test02",
        date: "Test02",
        date_req: "Test02"
      });


db.Listing.remove({}, function(err, listings){

  db.Listing.create(listingList, function(err, listings){
    if (err) { return console.log('Error', err); }
    console.log("all listings", listings);
    console.log("created", listings.length, "listings");
    process.exit();
  });
});
