var express = require('express');
var router = express.Router();
var socket;

router.get('/', function(req, res, next) {

    res.render('v2', {
        title: 'Google home v2'
    });

});

module.exports = function(io){
    socket = io;
    return router;
};




