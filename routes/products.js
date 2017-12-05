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
         * #intent: Welcome Intent
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
                    speech: "Hey, welcome back! How can I help?"
                });
            }
            else{
                userID = req.body.originalRequest.data.user.userId;
                return res.json({
                    speech: "Hi! I'm e-sites virtual assistant. I am designed to give advice and help about hammer products. How can I help you?"
                });
            }

        }

        /**
         * #Intent: Searching Yes Custom
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

                    productPlacement = "You can find " + result[0].fullProductName + " " + "in " + result[0].location;
                    var newPlacement = {};
                    var key = "speech";
                    newPlacement[key] = productPlacement;

                    console.log("productPlacement: " + productPlacement);

                    socket.emit('productName', { productName: result[0].fullProductName});

                    return res.json(newPlacement);

                }else{
                    socket.emit('noProduct', { data: "no product found"});
                   return res.json({
                       speech: "I'm sorry, I couldn't find that. Try specifying the type of product you are looking for."
                   });
                }
            }, inputArray);

         }


        /**
         * #Intent: Project intent
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

            // sledge hammer inhoud
            if(Object.values(req.body.result.parameters)[1]){
                console.log('sledge hammer inhoud!!');
                socket.emit('productName', { productName: "sledge hammer"});
                return res.json({
                    speech: "For those jobs, you will need sledge hammers. These are big hammers designed to destroy objects."
                });
            }

            //toolmaker hammer inhoud
            if(Object.values(req.body.result.parameters)[2]){
                console.log('Toolmaker hammer inhoud!!');
                socket.emit('productName', { productName: "toolmaker hammer"});
                return res.json({
                    speech: "For that work, you will need a toolmaker hammer. These are hammers with a magnifying glass on top."
                });
            }

            //No project found
            // socket.emit('noProduct', { data: "no product found"});
            // return res.json({
            //     speech: "I didn't understand that, can you rephrase the project you are working on?"
            // });
        }

        /**
         * #Intent: Parts Curved Claw hammer
         */
        if (req.body.result.metadata.intentId === "c2708040-2664-48a1-914f-79c7eeafa2bb"){
            socket.emit('productName', { productName: "curved claw hammer parts"});
            return res.json({
                speech: "Have a look at the screen. A curved claw hammer exists of 6 different parts. That is the Claw,. Eye,. Cheek,. Neck,. Poll,. and the face."
            });
        }
        
        /**
         * #Intent: Bye 
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
         * #Intent: claw hammer
         * change background image to hammer toolwand
         */
        if (req.body.result.metadata.intentId === "00768954-4b2e-4e79-8f79-f20d5fda1818"){

            mongoDBqueries.findProductNr(function(result) {
                console.log("MONGODB RESULT:" + JSON.stringify(result));

                console.log(result[0].fullProductName);
                console.log(result[0].imgPath);
                console.log(result[0].type);

                // afbeelding van dit result mee sturen naar client
                // full naam meesturen van dit image

            }, "32423");


            // Emit background image source
            socket.emit('hammerBackground', { imgSrc: "bgNew.jpg"});

            // Emit product name to change image
            socket.emit('productImageNew', { productImageNew: ""});


            return res.json({
                speech: "You are looking for claw hammers is that correct? / You can find claw hammers in row 4 section B"
            });
        }

        /**
         * save input query into mongoDB for research
         * @var string productName
         */
        // var productName = req.body.result.resolvedQuery;
        // console.log("ResolvedQuery: " + productName);
        //mongoDBqueries.insertQuery(function(result){}, productName);


        /**
         * Check if context parameter is empty
         * Check if context parameter contains product thats inside database
         * Get context parameter of json request
         * @var string productType
         * @var string productType2
         */
        // var productType =  req.body.result.contexts[0].parameters;
        // console.log(JSON.stringify(productType)); 

        // var obj = productType;
        // var productType2 =  obj[Object.keys(obj)[1]];
        // console.log("ProductType2: " + productType2);

        // socket.emit('productName', { productName: productType2});

    }

});


module.exports = function(io){
    socket = io;
    return router;
};

