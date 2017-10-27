var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var socket_io  = require('socket.io');

// ***************
// USE ROUTES NEW
// ***************
var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// Socket.io
var io = socket_io();
app.io = io;

var index = require('./routes/index')(io);
var product = require('./routes/products')(io);
var tests = require('./routes/testPost')(io);

// socket.io events
io.on( "connection", function( socket ){
    console.log("SOCKET.IO: A user connected");

    // socket.emit('news', { hello: 'world' });

    // socket.on('vanuitClient', function (data) {
    //   console.log(data);
    // });

    socket.on('test', function(data){
      console.log(data);
    })

    socket.on('disconnect', function(){
        console.log("SOCKET.IO: user has disconnected"); 
    });

});




// Express init settings 
// ---------------------

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
//app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// ***************
// USE ROUTES NEW
// ***************
app.use('/', index);
app.use('/users', users);
app.use('/testPost', tests);
app.use('/products', product);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found - TG -');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
