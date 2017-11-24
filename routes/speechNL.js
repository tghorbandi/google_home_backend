var express = require('express');
var router = express.Router();
var mongoDBqueries = require('../controllers/mongoDB');
var socket;
var userID = null;

router.post('/', function(req, res) {

    if (!req.body) {

        return res.sendStatus(400);

    } else {

        if (req.body.result.metadata.intentId === "ce927094-960f-4f0d-8dd0-3b3e2ae65658") {

            socket.emit('speech', { text: "Hallo, ik ben ejsites, Waarmee kan ik je helpen?"});

            return res.json({
                speech: " "
            });
        }

        if (req.body.result.metadata.intentId === "e7cbd274-f73f-4f58-937c-165bb2b8708b") {

            socket.emit('speech', { text: "De hamers liggen in gangpad B. Sectie 3"});

            socket.emit('showText', { text0: "Gangpad B", text1: "Sectie 3"});

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

