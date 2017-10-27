var express = require('express');
var router = express.Router();
var mongoDBqueries = require('../controllers/mongoDB');

var producten = ["hamer", "saw", "paint", "nails", "hammer", "white paint"];

var _io;

// controleer of POST request zelfde string bevat als in producten array
function findProduct(product, productenArray){
    return (productenArray.indexOf(product) > -1);
}

// Handle post request .../products
router.post('/', function(req, res) {

  if (!req.body) {
  	return res.sendStatus(400);
  } else{


    var productName = req.body.result.resolvedQuery;

    // check als request product bevat
    var productGevonden  = findProduct(productName, producten);


    // Als een product overeenkomt, sla het op in de database
  	if (productGevonden == true){


      _io.emit('productName', { productName: productName});

      res.send(productName);
      // mongoDBqueries.insertProductName(function(result){
      //    console.log(result);
      // }, productName); 

    }else{
      res.send("No product found!");
      // _io.emit('noProduct', { noProduct: 'Geen product'});
    }
  }
});


module.exports = function(io){
  _io = io;
  return router;
};

