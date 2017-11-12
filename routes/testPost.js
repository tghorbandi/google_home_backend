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


            //console.log("body: " + JSON.stringify(req.body));
            console.log("contexts: " + JSON.stringify(req.body.result.contexts.parameters));

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

                // Same user 
                if(req.body.originalRequest.data.user.userId === userID){
                    return res.json({
                        speech: "Hi! I'm e-sites digital assistant. How can I help?"
                    });
                } // New user
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
            * Returns end conversation fulfillment
            * Sends reset socket object to client to reset image and text
            */
            //console.log("intentId: " + req.body.result.metadata.intentId);
            if (req.body.result.metadata.intentId === "fe0e8ad6-3c74-4261-afaa-6f72d46db370"){
                return res.json({
                    speech: "Okay, Bye",
                    data: {
                        google: {
                            expect_user_response: false,
                        }
                    },
                    contextOut: [],
                });
                // Reset UI client
                socket.emit('reset', { reset: "true"});
            }


            /**
            * save input query into mongoDB for research
            * @var string productName
            */
            var productName = req.body.result.resolvedQuery;
            console.log("ResolvedQuery: " + productName);
            mongoDBqueries.insertQuery(function(result){}, productName);

            // Get context parameter van json request
            var productType =  req.body.result.contexts[0].parameters;
            var productType2 = productType[Object.keys(productType)[0]];
            console.log("ProductType2: " + productType2);

            socket.emit('productName', { productName: productType2});

            return res.sendStatus(200);
    


 /*       

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

