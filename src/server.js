'use strict';
var http = require('http'),
path = require('path'),
async = require('async'),
socketio = require('socket.io'),
express = require('express'),
engine = require('express-dot-engine'),
router = express(),
server = http.createServer(router),
io = socketio.listen(server),
fs = require('fs'),
memAddresses = [{
    addName: 'Server-side test',
    storeName: 'Some Store',
    addrLine1: '123 Some Rd',
    addrLine2: null,
    city: 'Lexington',
    country: 'USA',
    state: 'Kentucky',
    zipCode: '40404',
    id: 'addy-1'
}],
removeAddressById = function(id, fn) {
    var i = 0,
    addressCnt = memAddresses.length;

    for (i; i < addressCnt; i += 1) {
        if (memAddresses[i].id === id) {
            memAddresses.splice(i, 1);

            return fn(true);
        }
    }

    return fn(false);
},
findAddressById = function(id, fn) {
    var i = 0,
    addressCnt = memAddresses.length;

    for (i; i < addressCnt; i += 1) {
        if (memAddresses[i].id === id) {
            return fn(memAddresses[i], i);
        }
    }

    return fn(false);
},
updateRoster = function() {
    async.map(
        sockets,
        function (socket, callback) {
            socket.get('name', callback);
        },
        function (err, names) {
            broadcast('roster', names);
        }
    );
},
broadcast = function(event, data) {
    sockets.forEach(function (socket) {
        socket.emit(event, data);
    });
},
messages = [],
sockets = [];

process.env.PORT = 8180;

router.configure(function(){
    router.use(express.bodyParser());
    router.engine('dot', engine.__express);
    router.set('views', __dirname + '/client/views');
    router.set('view engine', 'dot');
    router.use('/etc', express.static(path.resolve(__dirname, 'client/etc')));
    router.use('/js', express.static(path.resolve(__dirname, 'client/js')));
    router.use('/img', express.static(path.resolve(__dirname, 'client/img')));
    router.use('/templates', express.static(path.resolve(__dirname, 'client/templates')));
    router.use('/tests', express.static(path.resolve(__dirname, 'client/tests')));
});

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

router.get('/service_requests/addresses/all', function(req, res) {
    console.log('All Addresses Sent to client');

    res.json(memAddresses);
});

router.get('/service_requests/addresses/new', function(req, res) {
    res.render(__dirname + '/client/views/index.dot', { NEWRELICID: process.env.NEWRELICID });
});

router.get('/service_requests/addresses/:id', function(req, res) {
    var id;

    if (!req.query.addressid) {
        id = req.params.id;
    } else {
        id = req.query.addressid;
    }

    console.log('Locating address by ID: ' + id);

    if (req.headers.accept.indexOf('json') > -1) {
        findAddressById(id, function(address) {
            if (address) {
                res.json(address);
            } else {
                res.send(400);
            }
        });
    } else {
         res.render(__dirname + '/client/views/index.dot', { NEWRELICID: process.env.NEWRELICID });
    }
});

router.post('/service_requests/addresses/:id', function(req, res) {
    findAddressById(req.params.id, function(address, addressIndex) {
        var prop; // looping through existing addresses properties to update

        if (!address) {
            if (req.files.file) {
                req.body.fileName = req.files.file.name;
                req.body.hadAttachment = true;

                fs.readFile(req.files.file.path, function(err, fileData) {
                    fs.writeFile('./uploads/' + req.files.file.name, fileData,function() {  
                        console.log(req.files.file.name + ' was saved!');
                    });
                });
            } else {
                req.body.hadAttachment = false;
            }

            req.body.id = 'addy-' + Math.random().toString(36).substring(2, 7);

            if (req.body.addName) {
                memAddresses.push(req.body);
            }

            console.log('Address Saved');
            res.json(req.body);
        } else {
            for (prop in req.body) {
                address[prop] = req.body[prop];
            }

            address.updated = true;

            console.log('Address Updated!');
            
            res.json(address);
        }
    });
});

router.delete('/service_requests/addresses/:id', function(req, res) {
    removeAddressById(req.params.id, function(deleted) {
        console.log(req.params.id + ' was deleted!');
        res.json(memAddresses);
    });
});

router.all('/*', function(req, res, next) {
    res.render(__dirname + '/client/views/index.dot', { NEWRELICID: process.env.NEWRELICID });
});

server.listen(process.env.PORT || 3000, process.env.IP || '0.0.0.0', function() {
    var addr = server.address();
    console.log('Customer Portal server listening at', addr.address + ':' + addr.port);
});
