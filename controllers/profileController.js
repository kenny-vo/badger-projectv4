/************
 * DATABASE *
 ************/

 var db = require('../models');

 function indexUnique(req, res) {
   db.User.findById(req.user, function (err, user) {
     console.log(req.user)
     if (err) {console.log(err);}
     db.Listing.find({uid: req.user}, function(err, listings) {
       console.log(listings.uid );
       if(err) { console.log('Error', err); }
       res.json(listings);
     });
   })
 }

 module.exports = {
   indexUnique: indexUnique
 };
