var express = require('express');
var router = express.Router();
var mongoDBqueries = require('../controllers/mongoDB');
var socket;

// Set Variables
var intro = 1;
var inhoud = null;

  router.post('/', function(req, res) {

        if (!req.body) {

            return res.sendStatus(400);

        } else{

        // Save Query in variable
        var productName = req.body.result.resolvedQuery;
        console.log("JSON resolvedQuery: " + productName);

        console.log(req.body);

        // check first time for a welcome intent
        // after the first time, give other welcome responses
        if (intro === 1){
            var welcome = req.body.result.action;
            if (welcome === "input.welcome"){
                intro = 2;
                return res.json({
                    speech: "Hi! I'm e-sites digital assistant. I am designed to give advice and help about Do-it-Yourself store products. How can I help you?"
                });
            }
        }else{
            return res.json({
                speech: "Hi! I'm e-sites digital assistant. How can I help?"
            });
        }


        // Save query variable in mongoDB
        //mongoDBqueries.insertQuery(function(result){}, productName);

        //Get context parameter van json request
        var productType =  req.body.result.contexts[0].parameters;
        var productType2 = productType[Object.keys(productType)[0]];


        if(req.body.result.contexts[0].name === "sledge_hammer"){
            productType2 = "sledge hammer";
            socket.emit('productName', { productName: productType2});
        }

        console.log("productType2: " + productType2);

        // //context overeenkomt met product in database
        mongoDBqueries.findProduct(function(result){
              //console.log(result);
              inhoud = result;
          }, productType2);


        socket.emit('productName', { productName: productType2});


        // Als er inderdaad een overeenkomst is in de database
        if(inhoud === true){
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
