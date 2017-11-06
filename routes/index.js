var express = require('express');
var router = express.Router();
var mongoDBqueries = require('../controllers/mongoDB');

var productName;
var productImgPath;
var socket;
var imageSrc;

// GET home page
router.get('/', function(req, res, next) {

    // socket.on('productName', function(data){ 
    //     console.log(data); 
    //     productName = data; 
    // });



    res.render('index', { 
        title: ''
    });


});



//module.exports = router;

module.exports = function(io){
  socket = io;
  return router;
};




