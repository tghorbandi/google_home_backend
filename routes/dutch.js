var express = require('express');
var router = express.Router();
var socket;

router.get('/', function(req, res, next) {

    res.render('dutch', {
        title: 'Google home Dutch'
    });

});

module.exports = function(io){
    socket = io;
    return router;
};




