//
// # SimpleServer
//
// A simple chat server using Socket.IO, Express, and Async.
//
var http = require('http');
var path = require('path');

var async = require('async');
var socketio = require('socket.io');
var express = require('express');
var engine = require('express-dot-engine');

process.env.PORT = 8080;

//
// ## SimpleServer `SimpleServer(obj)`
//
// Creates a new instance of SimpleServer with the following options:
//  * `port` - The HTTP port to listen on. If `process.env.PORT` is set, _it overrides this value_.
//
var router = express();
var server = http.createServer(router);
var io = socketio.listen(server);

router.configure(function(){
  router.engine('dot', engine.__express);
  router.set("views", __dirname + '/client/views');
  router.set('view engine', 'dot');
  router.use('/etc', express.static(path.resolve(__dirname, 'client/etc')));
  router.use('/js', express.static(path.resolve(__dirname, 'client/js')));
  router.use('/img', express.static(path.resolve(__dirname, 'client/img')));
  router.use('/templates', express.static(path.resolve(__dirname, 'client/templates')));
  router.use('/test', express.static(path.resolve(__dirname, 'client/test')));
});

var messages = [];
var sockets = [];

io.on('connection', function (socket) {
    messages.forEach(function (data) {
      socket.emit('message', data);
    });

    sockets.push(socket);

    socket.on('disconnect', function () {
      sockets.splice(sockets.indexOf(socket), 1);
      updateRoster();
    });

    socket.on('message', function (msg) {
      var text = String(msg || '');

      if (!text)
        return;

      socket.get('name', function (err, name) {
        var data = {
          name: name,
          text: text
        };

        broadcast('message', data);
        messages.push(data);
      });
    });

    socket.on('identify', function (name) {
      socket.set('name', String(name || 'Anonymous'), function (err) {
        updateRoster();
      });
    });
  });

function updateRoster() {
  async.map(
    sockets,
    function (socket, callback) {
      socket.get('name', callback);
    },
    function (err, names) {
      broadcast('roster', names);
    }
  );
}

function broadcast(event, data) {
  sockets.forEach(function (socket) {
    socket.emit(event, data);
  });
}

server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log("Customer Portal server listening at", addr.address + ":" + addr.port);
});

router.get('/', function(req, res) {
    res.render(__dirname + '/client/views/index.dot', { NEWRELICID: process.env.NEWRELICID, });
  });
