// GLOBAL variables
var express = require('express');
var router = express.Router();
var mongoDBqueries = require('../controllers/mongoDB');
var socket;
var userID = null;
var productPlacement;

router.post('/', function(req, res) {

    if (!req.body) {

        return res.sendStatus(400);

    } else{

        console.log("body: " + JSON.stringify(req.body));


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
         * In this statement, check if user input has a value that is the same as in the database.
         * Check if user entered "searching - yes - custom" intent.
         * Change resolved query string into an array, then use that array as a variable to check the database,
         */
         if (req.body.result.metadata.intentId === "d9689d6d-aa9c-4470-b2dc-a72fa1f6bc9f"){

            var input = req.body.result.resolvedQuery;
            //console.log("ResolvedQuery: " + input);

            var inputArray = input.split(" ");
            //console.log(inputArray);

            mongoDBqueries.findSpecificType(function(result){
                console.log("MONGODB RESULT:" + JSON.stringify(result));
                //console.log(result[0].type);
                if(result[0]){
                    productPlacement = "You can find the product " + result[0].location;
                    console.log("productPlacement SET!!" + productPlacement);
                    socket.emit('productName', { productName: result[0].fullProductName});
                    return res.json({
                        speech: "I have found your product, have a look at the screen, do you want to know where to find this product?"
                        //dit geeft yes/no terug, naar nieuwe intent, in dat intent moet je productplacement gebruiken om te laten zien
                        // waar het product licht. 
                    });
                }else{
                    socket.emit('noProduct', { data: "no product found"});
                   return res.json({
                       speech: "I'm sorry, I couldn't find that. Try specifying the type of product you are looking for."
                   });
                }
            }, inputArray);

         }


         /**
          * intent "Location product"
          */
          if (req.body.result.metadata.intentId === "bee1c466-9b92-4c2a-83e5-f2ca083c17c7"){

                
                console.log("productPlacement: " + productPlacement);
                var newPlacement = {};
                var key = "speech";
                newPlacement[key] = productPlacement;

                console.log(JSON.stringify(newPlacement));

                return res.json(newPlacement);

                // return res.json({
                //     speech: "test iekks"
                // });

                /* 
                productPlacement = "tteeeeee";
                var newPlacement = {};
                var key = "speech";
                newPlacement[key] = productPlacement;

                console.log(JSON.stringify(newPlacement))
                */

          }


         /**
          * intent "Direct search"
          */
          if (req.body.result.metadata.intentId === "46e9f973-d7aa-40ab-92d4-0a02cc5f4e7e"){

             var input = req.body.result.resolvedQuery;
             console.log("ResolvedQuery: " + input);

             var inputArray = input.split(" ");
             console.log(inputArray);

             mongoDBqueries.findSpecificType(function(result){
                 console.log("MONGODB RESULT:" + JSON.stringify(result));
                 //console.log(result[0].type);
                 if(result[0]){
                     socket.emit('productName', { productName: result[0].fullProductName});
                     return res.json({
                         speech: "I have found your product, have a look at the screen. This is how your product looks like. Click on the image for more information"
                     });
                 }else{
                     socket.emit('noProduct', { data: "no product found"});
                     return res.json({
                         speech: "I'm sorry that is a not a valid type product, or that is a product that I do not know of.  Please try again."
                     });
                 }
             }, inputArray);

          }

        /**
         * Intent "project intent"
         * If user says something like: Rebuilding, look at the parameter and value
         * @var curved claw hammer = req.body.result.parameters)[0]
         * @var sledge hammer = req.body.result.parameters)[1]
         */
        if (req.body.result.metadata.intentId === "d351acb0-19f2-4e20-8dc3-b5b337dfb101"){

            // console.log(JSON.stringify(req.body.result.parameters));
            // console.log(Object.values(req.body.result.parameters)[0]);
            // console.log(Object.values(req.body.result.parameters)[1]);

            //curved claw hammer inhoud
            if(Object.values(req.body.result.parameters)[0]){

                socket.emit('productName', { productName: "curved claw hammer"});
                return res.json({
                    speech: "For that specific type of job, you will need a curved claw hammer. You can easily remove nails with its curved claw"
                });
            }

            //sledge hammer inhoud
            if(Object.values(req.body.result.parameters)[1]){

                socket.emit('productName', { productName: "sledge hammer"});
                return res.json({
                    speech: "For that specific type of job, you will need sledge hammers. These are big hammers designed to destroy objects."
                });
            }

            //No project found
            socket.emit('noProduct', { data: "no product found"});
            return res.json({
                speech: "I didn't understand that, can you rephrase the project you are working on?"
            });


        }

        /**
         * User doesn't want product location (Don't want location intent)
         * Reset GUI client to google home, and remove talking icon.
         */
        if (req.body.result.metadata.intentId === "675c0d4b-fe09-4386-adaa-977fc0299586"){
            socket.emit('reset', { reset: "true"});
        }
         

        /**
         * Check if user entered "end" intent.
         * Sends reset socket object to client to reset image and text
         * Returns end conversation fulfillment
         */
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

        //return res.sendStatus(200);


    }

});


module.exports = function(io){
    socket = io;
    return router;
};

