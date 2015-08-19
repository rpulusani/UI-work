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
memory = {
    addresses: [{
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
    contacts: [],
    requests: []
},
removeById = function(memType, id, fn) {
    var i = 0,
    memCnt = memory[memType].length;

    for (i; i < memCnt; i += 1) {
        if (memory[memType][i].id === id) {
            memory[memType].splice(i, 1);

            return fn(true);
        }
    }

    return fn(false);
},
findById = function(memType, id, fn) {
    var i = 0,
    memCnt = memory[memType].length;

    for (i; i < memCnt; i += 1) {
        if (memory[memType][i].id === id) {
            return fn(memory[memType][i], i);
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

process.env.PORT = 8080;

router.configure(function(){
    router.use(express.bodyParser());
    router.engine('dot', engine.__express);
    router.set('views', __dirname + '/client/views');
    router.set('view engine', 'dot');
    router.use('/etc', express.static(path.resolve(__dirname, 'client/etc')));
    router.use('/app', express.static(path.resolve(__dirname, 'client/app')));
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

router.get('/accounts/1/:requestType', function(req, res) {
    console.log('All ' + req.params.requestType + ' Sent to client');

    res.json(memory[req.params.requestType]);
});

router.get('/accounts/1/:requestType/new', function(req, res) {
    res.render(__dirname + '/client/views/index.dot', { NEWRELICID: process.env.NEWRELICID });
});

router.get('/accounts/1/:requestType/:id', function(req, res) {
    var id;

    if (!req.query.id) {
        id = req.params.id;
    } else {
        id = req.query.id;
    }

    console.log('Locating ' + req.params.requestType + ' by ID: ' + id);

    if (req.headers.accept.indexOf('json') > -1) {
        findById(req.params.requestType, id, function(record) {
            if (record) {
                res.json(record);
            } else {
                res.send(400);
            }
        });
    } else {
         res.render(__dirname + '/client/views/index.dot', { NEWRELICID: process.env.NEWRELICID });
    }
});

router.post('/accounts/1/:requestType', function(req, res) {
    if (req.files.file) {
        req.body.fileName = req.files.file.name;
        req.body.hadAttachment = true;

        fs.readFile(req.files.file.path, function(err, fileData) {
            fs.writeFile('./uploads/' + req.files.file.name, fileData, function() {
                console.log(req.files.file.name + ' was saved!');
            });
        });
    } else {
        req.body.hadAttachment = false;
    }

    req.body.id = Math.random().toString(36).substring(2, 7);

    if (req.body.addName || req.body.firstName) {
        memory[req.params.requestType].push(req.body);
    }

    console.log(memory[req.params.requestType]);

    console.log(req.params.requestType + ' Saved');

    res.json(req.body);
});

router.post('/accounts/1/:requestType/:id', function(req, res) {
    findById(req.params.requestType, req.params.id, function(record, recordIndex) {
        var prop; // looping through existing entries properties to update
        
        for (prop in req.body) {
            record[prop] = req.body[prop];
        }

        record.updated = true;

        console.log(req.params.requestType + ' Updated!');
        
        res.json(record);
    });
});

router.delete('/accounts/1/:requestType/:id', function(req, res) {
    removeById(req.params.requestType, req.params.id, function(deleted) {
        console.log(req.params.id + ' was deleted!');
        res.json(memory[req.params.requestType]);
    });
});

router.all('/*', function(req, res, next) {
    var languages = req.headers['accept-language'].split(',').map(function(lang) {
        return lang.split(';')[0];
    });
    res.render(__dirname + '/client/views/index.dot', {
        languages_json: JSON.stringify(languages),
        NEWRELICID: process.env.NEWRELICID
    });
});

server.listen(process.env.PORT || 3000, process.env.IP || '0.0.0.0', function() {
    var addr = server.address();
    console.log('Customer Portal server listening at', addr.address + ':' + addr.port);
});
