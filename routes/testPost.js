var express = require('express');
var router = express.Router();
var mongoDBqueries = require('../controllers/mongoDB');
var socket;

var inhoud;

  router.post('/', function(req, res) {

    if (!req.body) {

    	return res.sendStatus(400);

    } else{

      // Query in DB zetten
      var productName = req.body.result.resolvedQuery;
      console.log("JSON resolvedQuery: " + productName);

      // Opslaan in database
      //mongoDBqueries.insertQuery(function(result){}, productName);

      //Get context parameter van json request
      var productType =  req.body.result.contexts[0].parameters;
      var productType2 = productType[Object.keys(productType)[0]];
      console.log("productType2: " + productType2);

      // //context overeenkomt met product in database
      mongoDBqueries.findProduct(function(result){
            //console.log(result);
            inhoud = result;
        }, productType2);


      socket.emit('productName', { productName: productType2});

      // Als er inderdaad een overeenkomst is in de database
      if(inhoud){
        console.log('inhoud!');
        // product / context doorsturen naar client
        socket.emit('productName', { productName: productType2});
      }else{
        // Als er geen product overeenkomsten zijn met database

        //socket.emit('noProduct', { data: "No product found"});

          // return res.json({
          //     speech: "Default webhook response"
          // });
      }


      // if(req.body.result.resolvedQuery.indexOf('find')){
      //   return res.json({
      //           speech: "What product are you looking for?",
      //   });
      // }

      // return res.json({
      //     speech: "testing from webhook",
      //     followupEvent: {
      //       "name": "fill_slots",
      //       "data": {
      //         "food": "chicken",
      //         "amount": "200"
      //       },
      //     }
      // });



  }

});


module.exports = function(io){
  socket = io;
  return router;
};


/*

    return res.json({
        speech: "testing from webhook",
        //displayText: "testing from webhook",
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
          "name": "fill_slots",
          "data": {
            "<parameter_name>": "<parameter_value>"
          }
        }
    });

*/
