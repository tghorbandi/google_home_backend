var express = require('express');
var router = express.Router();
var mongoDBqueries = require('../controllers/mongoDB');
var socket;
var userID = null;

router.post('/', function(req, res) {

    if (!req.body) {

        return res.sendStatus(400);

    } else {


        return res.sendStatus(200);

        // console.log("body: " + JSON.stringify(req.body));
        //
        //
        // /**
        //  * #intent: Welcome Intent
        //  */
        // if (req.body.result.action === "input.welcome") {
        //
        //     //socket.emit('loading', {loading: "true"});
        //
        // }
        //
        // /**
        //  *
        //  */
        // if (req.body.result.metadata.intentId === " ") {
        //
        // }
    }


});


module.exports = function(io){
    socket = io;
    return router;
};

