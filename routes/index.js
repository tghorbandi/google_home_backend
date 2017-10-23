var express = require('express');
var router = express.Router();
var mongoDBqueries = require('../controllers/mongoDB');

var producten = ["hamer", "saw", "paint"];


// GET home page
router.get('/', function(req, res, next) {


	// als er in db product hamer staat laat productName en productImage zien

	mongoDBqueries.showImage(function(result){
	   imageSrc = result;
	   res.render('index', { title: 'Jouw product', image2: imageSrc});
	});

});

/*io.on('connection', function(socket){
    socket.emit('auth'); //will be emitted only once to each socket.
    socket.on('userParameters',function(params){
         socket.join(params.room);
         socket.user = params.user;
         console.log(socket.user+' has connected to '+params.room)
    });
    socket.on('disconnect', function(){
          console.log(socket.user+' has disconnected'); //disconnecting automatically removes the socket from the room.
    });
});*/


module.exports = router;





