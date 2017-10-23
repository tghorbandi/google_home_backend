var express = require('express');
var router = express.Router();
var mongoDBqueries = require('../controllers/mongoDB');

var productName = 'testProduct1';

var producten = ["hamer", "saw", "paint"];

// controleer of POST request zelfde string bevat als in producten array
function findProduct(product, productenArray){
    return (productenArray.indexOf(product) > -1);
}


/* GET users listing. */
router.post('/', function(req, res) {

  if (!req.body) {
  	return res.sendStatus(400);
  } else{


    var productGevonden  = findProduct(req.body.query, producten);
    // Als er een product overeenkomt 
    // sla het ook op in de database

  	if (productGevonden == true){

      var productName = req.body.query;
      res.send(productName);
      mongoDBqueries.insertProductName(function(result){
         console.log(result);
      }, productName); // <-- letop: 2e argument is dus buiten deze functie
      // want de eerste functie is callback bij insertproductname, tweede argument
      // is productName
      // var insertProductName = function(callback, productName) 
      // callback = functtion(result){} / is t zelfde dus!

    }else{
      res.send("No product found!");
    }
  }
});


module.exports = router;

