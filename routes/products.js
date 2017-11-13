// GLOBAL variables
var express = require('express');
var router = express.Router();
var mongoDBqueries = require('../controllers/mongoDB');
var socket;
var userID = null;

router.post('/', function(req, res) {

    if (!req.body) {

        return res.sendStatus(400);

    } else{

        console.log("body: " + JSON.stringify(req.body));

        // Data request
        //console.log("OR.Data: " + req.body.originalRequest.data);


        /**
         * Check if inside "tell me productname" intent
         */
        if(req.body.result.metadata.intentId === "f493240d-4bf2-4ef3-9a19-1a36916e61e8"){
            console.log("body22: " + JSON.stringify(req.body));
            return res.json({
                speech: "testing webhook"
            });
        }

        /** TODO//
         * Check if context finding-hammer contains product in the database
         * Check which hammer it is
         * return product
         * return no product found
         */


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
                    speech: "Hi! I'm e-sites digital assistant. I am designed to give advice and help about hammer products. How can I help you?"
                });
            }

        }


        /**
         * Check if user entered "end" intent.
         * Sends reset socket object to client to reset image and text
         * Returns end conversation fulfillment
         */
        console.log("intentId: " + req.body.result.metadata.intentId);
        if (req.body.result.metadata.intentId === "50e7d411-c5da-497e-8a34-5eae79e0a744"){

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
        //mongoDBqueries.insertQuery(function(result){}, productName);


        /**
         * Check if context parameter is empty
         * Check if context parameter contains product thats inside database
         * Get context parameter of json request
         * @var string productType
         * @var string productType2
         */
        var productType =  req.body.result.contexts[0].parameters;
        console.log(JSON.stringify(productType)); // {"sledge_hammer.original":"","sledge_hammer":"sledge hammer"}

        var obj = productType;
        var productType2 =  obj[Object.keys(obj)[1]];
        console.log("ProductType2: " + productType2);

        socket.emit('productName', { productName: productType2});

        return res.sendStatus(200);


    }

});


module.exports = function(io){
    socket = io;
    return router;
};

