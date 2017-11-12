// GLOBAL variables
var express = require('express');
var router = express.Router();
var mongoDBqueries = require('../controllers/mongoDB');
var socket;

var intro = 1;
var inhoud = null;
var userID = null;

  router.post('/', function(req, res) {

        if (!req.body) {

            return res.sendStatus(400);

        } else{


            console.log("body: " + JSON.stringify(req.body));

            // Data request
            //console.log("OR.Data: " + req.body.originalRequest.data);


            /**
            * Let clientside know that it has to show loading icon
            * Check  for a welcome intent
            * If the same user is still talking, give another welcome message (should not happen, keep user in application)
            * NOTE: userId & conversationId resets after conversation end
            * @var int userID
            */
            if (req.body.result.action === "input.welcome"){

                socket.emit('loading', { loading: "true"});

                if(req.body.originalRequest.data.user.userId === userID){
                    return res.json({
                        speech: "Hi! I'm e-sites digital assistant. How can I help?"
                    });
                }
                else{
                    userID = req.body.originalRequest.data.user.userId;
                    return res.json({
                        speech: "Hi! I'm e-sites digital assistant. I am designed to give advice and help about Do-it-Yourself store products. How can I help you?"
                    });
                }

                return res.sendStatus(200);
            }


            /**
            * Check if user entered "end" intent.
            * Sends reset socket object to client to reset image and text
            * Returns end conversation fulfillment
            */
            console.log("intentId: " + req.body.result.metadata.intentId);
            if (req.body.result.metadata.intentId === "fe0e8ad6-3c74-4261-afaa-6f72d46db370"){

                // Reset UI client
                socket.emit('reset', { reset: "true"});

                return res.json({
                    speech: "Okay, Bye",
                    data: {
                        google: {
                            expect_user_response: false,
                        }
                    },
                    contextOut: [],
                });
            }


            /**
            * save input query into mongoDB for research
            * @var string productName
            */
            var productName = req.body.result.resolvedQuery;
            console.log("ResolvedQuery: " + productName);
            mongoDBqueries.insertQuery(function(result){}, productName);


            /**
            * Check if context parameter is empty
            * Check if context parameter contains product thats inside database
            * Get context parameter of json request 
            * @var string productType
            * @var string productType2
            */
            var productType =  req.body.result.contexts[0].parameters;
            console.log(JSON.stringify(productType)); // {"sledge_hammer.original":"","sledge_hammer":"sledge hammer"}

            for (const [k, v] of Object.entries(productType)) {
              console.log("Here is key ${k} and here is value ${v}");
            }

           // var productType2 = productType[Object.keys(productType)[0]];
            console.log("ProductType2: " + productType2);

            socket.emit('productName', { productName: productType2});

            return res.sendStatus(200);


 /*       

        // //context overeenkomt met product in database
        mongoDBqueries.findProduct(function(result){
              //console.log(result);
              inhoud = result;
          }, productType2);


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
*/
  }

});


module.exports = function(io){
  socket = io;
  return router;
};

