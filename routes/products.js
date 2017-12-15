var express = require('express');
var router = express.Router();
var mongoDBqueries = require('../controllers/mongoDB');
var socket;
var userID = null;
var productPlacement;
var fallback = 0;

var intentIdArray =
    ["00768954-4b2e-4e79-8f79-f20d5fda1818","57608d37-6414-4d26-81ee-880d5b08c81b", "42a6386d-000b-4d2e-b68a-592b3e7f9394","00768954-4b2e-4e79-8f79-f20d5fda1818", "00768954-4b2e-4e79-8f79-f20d5fda1818","00768954-4b2e-4e79-8f79-f20d5fda1818", "00768954-4b2e-4e79-8f79-f20d5fda1818","00768954-4b2e-4e79-8f79-f20d5fda1818", "00768954-4b2e-4e79-8f79-f20d5fda1818","00768954-4b2e-4e79-8f79-f20d5fda1818"
    ];

var continueNewIntent;

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
        if (req.body.result.metadata.intentId === "21922877-84d4-41b8-bf83-d63062322fff"){

            socket.emit('loading', { loading: "true", talking: "false"});

            if(req.body.originalRequest.data.user.userId === userID){
                return res.json({
                    speech: "Hey!, How can I help?"
                });
            }
            else{
                userID = req.body.originalRequest.data.user.userId;
                return res.json({
                    speech: "Hi! I'm e-sites virtual assistant. I'm pretty good in finding hammers, do you want me to find a hammer for you?"
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

                    productPlacement = "You can find " + result[0].fullProductName + " " + "in " + result[0].location + ". " + " Have a look at the screen, this is how the hammer looks like. would you like more information about this product?";
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
        // if (req.body.result.metadata.intentId === "c2708040-2664-48a1-914f-79c7eeafa2bb"){
        //     socket.emit('productName', { productName: "curved claw hammer parts"});
        //     return res.json({
        //         speech: "Have a look at the screen. A curved claw hammer exists of 6 different parts. That is the Claw,. Eye,. Cheek,. Neck,. Poll,. and the face."
        //     });
        // }
        
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
         * Check if productnr exists in database, then find that product
         */
        // if (req.body.result.metadata.intentId === "00768954-4b2e-4e79-8f79-f20d5fda1818"){
        //
        //     mongoDBqueries.findProductNr(function(result) {
        //         console.log("MONGODB RESULT:" + JSON.stringify(result));
        //
        //         // console.log(result[0].fullProductName);
        //         // console.log(result[0].imgPath);
        //         // console.log(result[0].type);
        //
        //
        //         if(result){
        //
        //             // Emit product name & description & image path from database.
        //             socket.emit('productDetails', { productName: result[0].fullProductName, productDescription: result[0].description, productImageNew: result[0].imgPath, productLocation: result[0].location });
        //
        //             // Emit background image
        //             socket.emit('hammerBackground', { imgSrc: ""});
        //
        //             // Emit product name to change image
        //             //socket.emit('productImageNew', { productImageNew: result[0].imgPath});
        //
        //             // Breadcumb navbar position
        //             //socket.emit('breadcrumb', { string: "Bahco klauwhamer 429-16"});
        //
        //             return res.json({
        //                 speech: "You are looking for claw hammers is that correct? / You can find claw hammers in row 4 section B"
        //             });
        //
        //         }else{
        //             return res.json({
        //                 speech: "I'm sorry there went something wrong with retrieving products from the database."
        //             });
        //         }
        //
        //
        //     }, "32423");
        //
        // }

        /**
         * #Intent: claw hammer & regular hammer & advice sledge hammer yes & advice claw hammer yes
         * Check if productnr exists in database, then find that product
         */

        if (req.body.result.metadata.intentId === "00768954-4b2e-4e79-8f79-f20d5fda1818" || req.body.result.metadata.intentId === "55c24519-5439-4cbe-a0c0-2159d5c71e4e" || req.body.result.metadata.intentId === "01bca801-fd72-4b4d-ad2f-5048747b96db" || req.body.result.metadata.intentId === "cd5499b9-06e2-4fa6-a8e9-755288475d2c" || req.body.result.metadata.intentId === "08ad93bd-8f49-4cd6-be92-927af69d8435" || req.body.result.metadata.intentId === "890138a2-f61a-4108-a87b-1d77cc52bda9" || req.body.result.metadata.intentId === "6c5e4679-061e-4145-8c4d-fad63a6925e6" || req.body.result.metadata.intentId === "741b2be6-5787-49b5-9419-a98dda77e816" || req.body.result.metadata.intentId === "2adf6c5e-23de-4d5d-8670-8c0260e2dcd9" || req.body.result.metadata.intentId === "57608d37-6414-4d26-81ee-880d5b08c81b" || req.body.result.metadata.intentId === "42a6386d-000b-4d2e-b68a-592b3e7f9394"){

            // claw hammer
            if(req.body.result.metadata.intentId === "01bca801-fd72-4b4d-ad2f-5048747b96db"){
                req.body.result.metadata.intentId = "00768954-4b2e-4e79-8f79-f20d5fda1818";
            }
            // sledge hammer
            if(req.body.result.metadata.intentId === "cd5499b9-06e2-4fa6-a8e9-755288475d2c"){
                req.body.result.metadata.intentId = "6c5e4679-061e-4145-8c4d-fad63a6925e6";
            }

            continueNewIntent = req.body.result.metadata.intentId;

            mongoDBqueries.findProductWithIntentId(function(result) {

                console.log(result);

                if(result){
                    socket.emit('productDetails', {
                        productName: result[0].fullProductName,
                        productDescription: result[0].description,
                        productImageNew: result[0].imgPath,
                        productLocation: result[0].location,
                        productPrice: result[0].price
                    });
                    socket.emit('hammerBackground', { imgSrc: ""});


                    productPlacement = "You can find this hammer" + " " + "in " + result[0].location + ". Have a look at the screen, this is how the hammer looks like";
                    var newPlacement = {};
                    var key = "speech";
                    newPlacement[key] = productPlacement;

                    console.log("productPlacement: " + productPlacement);

                    return res.json(newPlacement);

                    // return res.json({
                    //     speech: "You are looking for claw hammers is that correct? / You can find claw hammers in row 4 section B"
                    // });
                }else{
                    return res.json({
                        speech: "I'm sorry there went something wrong with retrieving products from the database."
                    });
                }
            }, req.body.result.metadata.intentId);
        }



        /**
         * #intent: Give me more information
         * @var continueNewIntent (bij find product intent geset)
         * @array intentIdArray (alle intentIds met hamers)
         */
        if(req.body.result.metadata.intentId === ""){
            //Give me more information about that intentID
            // if (continueNewIntent === intentIdArray){
            //
            // }

            //slate hammer == 1e038746-2c92-4ad1-9682-ebdb33f089f1
        }







        /**
         * #intent: list of all hammers
         * outgoing context meegeven om weer naar welcome intent te gaan.
         */
        if(req.body.result.metadata.intentId === "b7bfba95-4293-4d32-a206-751e48f10b15") {

            socket.emit('allHammers', { showList: "true" });

            return res.json({
                speech: "Here is a list of all hammers that I can help you with. When you need information about a specific hammer on the list. just tell me the hammer name, and i will know what to do."

            })

        }


        /**
         * #intent: what can you do
         */
        if(req.body.result.metadata.intentId === "3e807c68-aab5-47e3-b030-48fdec0bed2e") {

            socket.emit('loading', { loading: "true", talking: "true"});

            return res.json({
                speech: "I can do lots of things., You can ask me for advice, or I can help you find specific products. At this moment however, I can only help with finding hammer products. So.. to fullfill my duty, I have to ask, are you looking for a hammer?",
                 contexts: [
                    {
                        "name": "whatcanyoudo-followup",
                        "parameters": {},
                        "lifespan": 2
                    }]
            })

        }







        /**
         * if dialog goes in fallback three times
         * @var int fallback
         * outgoing context meegeven om weer naar welcome intent te gaan.
         */
        if(req.body.result.metadata.intentId === "224ab83a-266e-4868-8ca4-856d3ea9b669"){

            console.log("FALLBACKKKK!!!!");

            if(fallback < 3){

                fallback++;

            }else{
                return res.json({
                    speech: "I'm sorry, something went terribly wrong, I'm going to contact a human colleague.. please wait."
                });
            }
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

