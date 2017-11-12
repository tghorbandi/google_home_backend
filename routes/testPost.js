var express = require('express');
var router = express.Router();
var mongoDBqueries = require('../controllers/mongoDB');
var socket;

// Set Variables
var intro = 1;
var inhoud = null;
var userID = null;

  router.post('/', function(req, res) {

        if (!req.body) {

            return res.sendStatus(400);

        } else{

            // Let clientside know that it has to show loading icon
            // Check  for a welcome intent
            // If the same user is talking, give another welcome message.
            var welcome = req.body.result.action;
            if (welcome === "input.welcome"){

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

            // Save Query in variable
            var productName = req.body.result.resolvedQuery;
            console.log("ResolvedQuery: " + productName);

            // Get context parameter van json request
            var productType =  req.body.result.contexts[0].parameters;
            var productType2 = productType[Object.keys(productType)[0]];
            console.log("ProductType2: " + productType2);

            socket.emit('productName', { productName: productType2});

            return res.sendStatus(200);
        

        // Save query variable in mongoDB
        //mongoDBqueries.insertQuery(function(result){}, productName);


/*
        // Check  for a welcome intent
        // If the same user is talking, give another welcome message.
        var welcome = req.body.result.action;
        if (welcome === "input.welcome"){
            // Same user 
            if(req.body.originalRequest.data.user.userId === userID){
                return res.json({
                    speech: "Hi! I'm e-sites digital assistant. How can I help?"
                });
            } // New user
            else{
                return res.json({
                    speech: "Hi! I'm e-sites digital assistant. I am designed to give advice and help about Do-it-Yourself store products. How can I help you?"
                });
            }
        }


        // console.log(req.body.originalRequest);

        //Data checken
        console.log("OR.Data: " + req.body.originalRequest.data);
        //conversationID
        console.log("ConversationID: " + req.body.originalRequest.data.conversation.conversationId);
        //userID
        console.log("UserID: " + req.body.originalRequest.data.user.userId); // user ID is steeds anders, na "google, stop"
        userID = req.body.originalRequest.data.user.userId;
*/


        // zodra de user klaar is met praten, webhook slot filled doen, en dan weet ik server side wanneer een user klaar is.
        // zo kan ik userID/conversationID in de gaten houden, en dan nieuw gesprek starten, nieuwe user



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
