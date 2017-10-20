var express = require('express');
var router = express.Router();

// var socket_io = require('socket.io');
var io = require('socket.io')

module.exports = function (io) { 

	io.on('connection', function(socket){
    	console.log('A user connected');
	});

	io.emit('news', { hello: 'world' });

}