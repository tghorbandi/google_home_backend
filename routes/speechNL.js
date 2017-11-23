var express = require('express');
var router = express.Router();
var mongoDBqueries = require('../controllers/mongoDB');
var socket;
var userID = null;

router.post('/', function(req, res) {

    if (!req.body) {

        return res.sendStatus(400);

    } else {

        if (req.body.result.metadata.intentId === "3f0a2917-4725-4aaf-9970-1f9f13852cba") {

            socket.emit('speech', { text: "De hamers liggen in gangpad B. Sectie 3"});

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

