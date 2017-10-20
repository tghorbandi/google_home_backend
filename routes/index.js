var express = require('express');
var router = express.Router();
var mongoDBqueries = require('../controllers/mongoDB');
var socketIOqueries = require('../controllers/socketIO');

/* GET home page. */
router.get('/', function(req, res, next) {


	// io.on('connection', function(socket){
 //    	console.log('A user connected');
	// });

	//  socket.on('news', function (data) {
	//     console.log(data);  
	//  });

	mongoDBqueries.showImage(function(result){
	   imageSrc = result;
	   res.render('index', { title: 'Jouw product', image2: imageSrc});
	});



});

module.exports = router;
