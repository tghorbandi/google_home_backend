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

            //socket.emit('speech', { text: "De hamers liggen in gangpad B. Sectie 3"});
            socket.emit('speech', { text: "Hallo, ik ben ejsites, Waarmee kan ik je helpen?"});

            console.log('testtt');
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

