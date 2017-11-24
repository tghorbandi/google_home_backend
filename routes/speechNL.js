var express = require('express');
var router = express.Router();
var mongoDBqueries = require('../controllers/mongoDB');
var socket;
var userID = null;

router.post('/', function(req, res) {

    if (!req.body) {

        return res.sendStatus(400);

    } else {

        /*
        * Welcome intent
        * */
        if (req.body.result.metadata.intentId === "ce927094-960f-4f0d-8dd0-3b3e2ae65658") {

            socket.emit('speech', { text: "Hallo, Waarmee kan ik je helpen?"});

            return res.json({
                speech: " "
            });
        }

        /*
        * Hamers
        * */
        if (req.body.result.metadata.intentId === "e7cbd274-f73f-4f58-937c-165bb2b8708b") {

            socket.emit('speech', { text: "De hamers liggen in gangpad B. rij 3"});

            socket.emit('text1', { text1: "Gangpad B"});
            socket.emit('text2', { text2: "Rij 3"});

            return res.json({
                speech: " "
            });

        }

        /*
        * Verf
        * */
        if (req.body.result.metadata.intentId === "4c2145e6-bf2c-429c-b7f8-672b928d52c8") {

            socket.emit('speech', { text: "De verf assortiment kun je vinden in gangpad D"});

            socket.emit('text1', { text1: "Gangpad D"});
            socket.emit('text2', { text1: " "});

            return res.json({
                speech: " "
            });

        }


        return res.sendStatus(200);

    }


});


module.exports = function(io){
    socket = io;
    return router;
};

