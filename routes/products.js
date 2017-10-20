var express = require('express');
var router = express.Router();
var mongoDBqueries = require('../controllers/mongoDB');

var productName = 'testProduct1';

/* GET users listing. */
router.post('/', function(req, res) {


  if (!req.body) {
  	return res.sendStatus(400);
  } else{
  	
    mongoDBqueries.insertProductName(function(result){
       console.log(result);
    }, productName);

    //res.send(req.body.username);
    res.sendStatus(200);
  }
});



module.exports = router;

/* 
module.exports = {}
module.exports.findDocuments = findDocuments;
module.exports.insertDocuments = insertDocuments;
*/





