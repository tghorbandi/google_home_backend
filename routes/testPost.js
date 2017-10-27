var express = require('express');
var router = express.Router();
var mongoDBqueries = require('../controllers/mongoDB');
var socket;

router.post('/', function(req, res) {

  if (!req.body) {

  	return res.sendStatus(400);

  } else{


    var productName = req.body.result.resolvedQuery;
      //opslaan in database
      mongoDBqueries.insertQuery(function(result){
         console.log(result);
      }, productName); 

    socket.emit('productName', { productName: productName});


    return res.json({
        speech: "testing from webhook",
        displayText: "testing from webhook",
        // data: {
        //     "slack": "test"
        // },
        // contextOut: [{
        //   "name": "testing", 
        //   "lifespan": 2, 
        //   "parameters": {
        //     "city": "Rome"
        //   }
        // }],
        source: 'webhook-echo-sample',
        followupEvent: {
          "name": "<event_name>",
          "data": {
            "<parameter_name>": "<parameter_value>"
          }
        }
    });




  }

});


module.exports = function(io){
  socket = io;
  return router;
};

