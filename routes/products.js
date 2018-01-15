var express = require('express');
var router = express.Router();
var mongoDBqueries = require('../controllers/mongoDB');
var socket;
var productPlacement;
var fallback = 0;
var continueNewIntent;
var userQuery;
var sameUser = 0;

var hammersIntentId = {
    "Regular hammer":       "55c24519-5439-4cbe-a0c0-2159d5c71e4e",
    "Claw Hammer":          "00768954-4b2e-4e79-8f79-f20d5fda1818",
    "Rubber Mallet":        "42a6386d-000b-4d2e-b68a-592b3e7f9394",
    "Slate hammer":         "1e038746-2c92-4ad1-9682-ebdb33f089f1",
    "Lump hammer":          "2adf6c5e-23de-4d5d-8670-8c0260e2dcd9",
    "Emergency hammer":     "08ad93bd-8f49-4cd6-be92-927af69d8435",
    "Wooden hammer":        "890138a2-f61a-4108-a87b-1d77cc52bda9",
    "Brick hammer":         "57608d37-6414-4d26-81ee-880d5b08c81b",
    "Prospector hammer":    "741b2be6-5787-49b5-9419-a98dda77e816",
    "Sledge hammer":        "6c5e4679-061e-4145-8c4d-fad63a6925e6",
};

//hammersIntentId['Regular hammer'];


router.post('/', function(req, res) {

    if (!req.body) {

        return res.sendStatus(400);

    } else{

        console.log(JSON.stringify(req.body));
        console.log(JSON.stringify(req.body.result.contexts[0]));
        console.log("intentName: " + JSON.stringify(req.body.result.metadata.intentName));



        /**
         * Send user query to client
         */
        userQuery = JSON.stringify(req.body.originalRequest.data.inputs[0].rawInputs[0].query);
        socket.emit('query', {query: userQuery});



        function compareIntentId (id) {
            var intents = {
                '21922877-84d4-41b8-bf83-d63062322fff': function () {
                    /**
                     *
                     * #Intent: Welcome Intent
                     *
                     */
                    socket.emit('loading', { loading: "true", talking: "false"});

                    if(sameUser < 1){
                        sameUser++;
                        //This code will only execute once
                        return res.json({
                            speech: "Hi! I'm e-sites virtual assistant. I am specialized in finding specific type of hammers. If you do not know the name of the hammer you are looking for, I can try and guess which hammer you need by asking what you are going to use the hammer for. Also, If you need advice what to say, just ask me for more information. let's start. Would you like to find a hammer?"
                        });
                    }else{
                        return res.json({
                            speech: "Hey! Welcome back, are you still looking for a hammer?"
                        });
                    }
                },
                'd9689d6d-aa9c-4470-b2dc-a72fa1f6bc9f': function () {
                    /**
                     *
                     * #Intent: Searching Yes Custom
                     *
                     */
                    var input = req.body.result.resolvedQuery;
                    //console.log("ResolvedQuery: " + input);
                    var inputArray = input.split(" ");
                    //console.log(inputArray);

                    mongoDBqueries.findSpecificType(function(result){
                        console.log("MONGODB RESULT:" + JSON.stringify(result));

                        if(result[0]){

                            productPlacement = "Based on what you said, I have found this hammer. Have a look on the screen. This is how the hammer looks like. You can find this hammer in " + result[0].fullProductName + " " + "in " + result[0].location + ". ";
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
                },
                /**
                 *
                 * #Intent: Searching Yes Custom
                 *
                 */
                '2cbc1bb9-8d90-4d28-8522-2f11e8161fd9': function () {
                    socket.emit('loading', { loading: "true", talking: "false"});
                },
                /**
                 *
                 * #Intent: Project intent
                 *
                 */
                'd351acb0-19f2-4e20-8dc3-b5b337dfb101': function () {
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
                },
                /**
                 *
                 * #Intent: STOP
                 *
                 */
                '50e7d411-c5da-497e-8a34-5eae79e0a744': function () {
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
                },
                /**
                 *
                 *
                 *
                 */
                '': function () {

                },
                /**
                 *
                 *
                 *
                 */
                '': function () {

                },
                /**
                 *
                 *
                 *
                 */
                '': function () {

                },
                /**
                 *
                 *
                 *
                 */
                '': function () {

                }
            };
            if (typeof intents[id] !== 'function') {
                /**
                 * #Intent: Default Welcome Intent - yes
                 */
                return res.json({
                    speech: "Something went wrong with the server.",
                    data: {
                        google: {
                            expect_user_response: false,
                        }
                    },
                    contextOut: [],
                });
            }
            return intents[id]();
        }

        compareIntentId(req.body.result.metadata.intentId);



        /**
         * #Intent: claw hammer & regular hammer & advice sledge hammer yes & advice claw hammer yes
         * Check if productnr exists in database, then find that product
         * contextOut ("yes-more-info-hammers) = New intent
         */

        if (req.body.result.metadata.intentId === "00768954-4b2e-4e79-8f79-f20d5fda1818" || req.body.result.metadata.intentId === "55c24519-5439-4cbe-a0c0-2159d5c71e4e" || req.body.result.metadata.intentId === "01bca801-fd72-4b4d-ad2f-5048747b96db" || req.body.result.metadata.intentId === "cd5499b9-06e2-4fa6-a8e9-755288475d2c" || req.body.result.metadata.intentId === "08ad93bd-8f49-4cd6-be92-927af69d8435" || req.body.result.metadata.intentId === "890138a2-f61a-4108-a87b-1d77cc52bda9" || req.body.result.metadata.intentId === "6c5e4679-061e-4145-8c4d-fad63a6925e6" || req.body.result.metadata.intentId === "741b2be6-5787-49b5-9419-a98dda77e816" || req.body.result.metadata.intentId === "2adf6c5e-23de-4d5d-8670-8c0260e2dcd9" || req.body.result.metadata.intentId === "57608d37-6414-4d26-81ee-880d5b08c81b" || req.body.result.metadata.intentId === "42a6386d-000b-4d2e-b68a-592b3e7f9394" || req.body.result.metadata.intentId === "b8cb95aa-19a9-4d44-8350-fd580f41b332" || req.body.result.metadata.intentId === "1e038746-2c92-4ad1-9682-ebdb33f089f1"){



            // claw hammer
            if(req.body.result.metadata.intentId === "01bca801-fd72-4b4d-ad2f-5048747b96db"){
                req.body.result.metadata.intentId = "00768954-4b2e-4e79-8f79-f20d5fda1818";
            }
            // sledge hammer
            if(req.body.result.metadata.intentId === "cd5499b9-06e2-4fa6-a8e9-755288475d2c"){
                req.body.result.metadata.intentId = "6c5e4679-061e-4145-8c4d-fad63a6925e6";
            }
            // rubber mallet, help find hammer
            if(req.body.result.metadata.intentId === "b8cb95aa-19a9-4d44-8350-fd580f41b332"){
                req.body.result.metadata.intentId = "42a6386d-000b-4d2e-b68a-592b3e7f9394";
            }

            continueNewIntent = req.body.result.metadata.intentId;

            mongoDBqueries.findProductWithIntentId(function(result) {

                //console.log(result);

                if(result){
                    socket.emit('productDetails', {
                        productName: result[0].fullProductName,
                        productDescription: result[0].description,
                        productImageNew: result[0].imgPath,
                        productLocation: result[0].location,
                        productPrice: result[0].price
                    });
                    socket.emit('hammerBackground', { imgSrc: ""});


                    productPlacement = "Based on what you said, I have found a hammer. Have a look on the screen. This is how the hammer looks like. You can find this hammer" + " " + "in " + result[0].location + "." + " " + ". Would you like more information about this hammer?";
                    var newPlacement = {};
                    var key = "speech";
                    var contextOut = [{"name":"yes-more-info-hammers", "lifespan":1}];
                    newPlacement[key] = productPlacement;
                    newPlacement["contextOut"] = contextOut;

                    console.log("newplacementJSON " + JSON.stringify(newPlacement));

                    return res.json(newPlacement);

                }else{
                    return res.json({
                        speech: "I'm sorry there went something wrong with retrieving products from the database."
                    });
                }
            }, req.body.result.metadata.intentId);
        }



        /**
         * #intent: More info hammers (YES)
         * @var continueNewIntent (bij find product intent geset)
         * @array intentIdArray (alle intentIds met hamers)
         */
        if(req.body.result.metadata.intentId === "f9d930c2-7c24-490f-a7a2-382034905df3"){

            console.log("MORE INFO INTENT!!");

            // check continueNewIntent foreach id in hammersIntentId array
            for (var id in hammersIntentId) {
                try{
                    if (!hammersIntentId.hasOwnProperty(id)) continue;
                    if (hammersIntentId[id] === continueNewIntent) {

                        mongoDBqueries.findProductWithIntentId(function(result) {

                            productDescription = result[0].description + ". " + "That's all i know about this hammer. Are you interested in finding another hammer?";
                            var obj = {};
                            var key = "speech";
                            obj[key] = productDescription;

                            return res.json(obj);

                        }, hammersIntentId[id]);

                    }
                } catch(err) {
                    console.log("ERROR: " + err);
                    return res.json({
                        speech: "I'm sorry, something went wrong with retrieving more information about this product. Try saying the hammer name again."
                    });
                }

            }

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
         * #intent: More info
         */
        if (req.body.result.metadata.intentId === "11151e8e-6e17-4217-a7f1-a2135b01d32b"){
            socket.emit('allHammers', { showList: "true" });
        }

        /**
         * #intent: more info hammers - no
         */
        if (req.body.result.metadata.intentId === "0274b602-b6ab-4a98-9eef-580341e2734e" ){
            socket.emit('loading', { loading: "true", talking: "true"});
        }

        //req.body.result.metadata.intentId === "ff75b860-3d4c-45c9-b56d-55c6a62331f8" ||


        /**
         * #intent: Default Welcome Intent - yes - no - fallback
         * If user says unknown usage multiple times.
         */

        if(req.body.result.metadata.intentId === "62bb5fd6-ea75-4c95-bbf2-8ca04cd26864"){

            console.log('newIntent');

            if (fallback < 1){
                fallback++;
                return res.json({
                    speech: "I am sorry, I could not find a hammer for that. Tell me again what you are going to use the hammer for."
                });
            }else{

                //Send info to client that inform employees are coming
                socket.emit('help', { help: "true"});

                return res.json({
                    speech: "I do not recognize that. Please wait while I am getting help of an employee.",
                    data: {
                        google: {
                            expect_user_response: false,
                        }
                    }
                });
            }

        }




        /**
         * #intemt: Default fallback
         * if dialog goes in fallback three times
         * @var int fallback
         * outgoing context meegeven om weer naar welcome intent te gaan.
         */
        if(req.body.result.metadata.intentId === "224ab83a-266e-4868-8ca4-856d3ea9b669"){

            console.log("FALLBACKKKK!!!!");

            return res.json({
                speech: "Sorry, I didn't get that. What hammer type are you looking for?",
                contexts: [
                    {
                        "name": "first-fallback",
                        "parameters": {},
                        "lifespan": 1
                    }]
            });

            if (fallback === 2){
                return res.json({
                    speech: "I am sorry, I could not find that hammer. Do you want a list of hammers you can choose from?"
                });
            }

            if(fallback < 3){

                fallback++;

            }else{
                return res.json({
                    speech: "Sorry, I could not answer your question. An employee is being called and will be here shortly."
                });
            }
        }


    }

});


module.exports = function(io){
    socket = io;
    return router;
};

