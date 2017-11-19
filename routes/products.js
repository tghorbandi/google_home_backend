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
         * Check if inside "tell me "Default Welcome Intent - yes - yes - custom" intent
         * Check if resolvedQuery meets content of database, if yes, retrieve that row, and show name and location
         *
         */
        // if(req.body.result.metadata.intentId === "96cca1ff-4122-45bc-9a4c-8c6b141b135a"){

        //     var product = req.body.result.resolvedQuery;
        //     if(product === "sledge hammer"){ // this check should be made in database and return location from db too
        //         return res.json({
        //             speech: "You are looking for sledge hammer -webhook"
        //         });
        //     }else{
        //         return res.json({
        //             speech: "I'm sorry your answer is either a product that I don't know about, or I haven't understood you properly. -webhook"
        //         });
        //     }

        // }

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
         * Check if user entered "searching - yes - custom" intent.
         * In this statement, check if user input has a value that is the same as in the database.
         * Node.js works Async, so everything has to be in the fallback of findProduct function.
         */
         if (req.body.result.metadata.intentId === "d9689d6d-aa9c-4470-b2dc-a72fa1f6bc9f"){

            var input = req.body.result.resolvedQuery;
            console.log("ResolvedQuery: " + input);

            var inputArray = input.split(" ");
            console.log(inputArray);

            var testArray = ["sledge", "toolmaker", "curved claw"];


            // eigenlijk moet callback een array worden ipv string
            var sledge = "sledge";
            var inhoud;



            // find alles
            mongoDBqueries.findAllTypes(function(result){

                  console.log("MONGODB RESULT:" + JSON.stringify(result));
                  // inhoud = result[0].type;
                  // console.log(inhoud);
                  // if in alle types 
              });
           

            // mongoDBqueries.findProduct(function(result){
            //       console.log("MONGODB RESULT:" + JSON.stringify(result));
            //       inhoud = result[0].type;
            //       console.log(inhoud);
            //       // if in alle types 
            //   }, sledge);

            

            // if (testArray.some(v => inputArray.includes(v)) === true ){
            //     console.log('true!');

            //     // welk woord komt overeen, pak daar de ID uit, met full_product_name en img location

            //     return res.json({
            //         speech: "I have found your product, have a look at the screen, is this the product you were looking for?"
            //     });
            // }else{
            //     return res.json({
            //         speech: "I'm sorry that is a not a valid product, or that is a product that I do not know of. Please try again."
            //     });
            // }


             return res.sendStatus(200);

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

