'use strict';
var http = require('http'),
path = require('path'),
async = require('async'),
express = require('express'),
engine = require('express-dot-engine'),
router = express(),
server = http.createServer(router),
fs = require('fs'),
memory = {
    addresses: [{
        addName: 'Server-side test',
        storeName: 'Some Store',
        addrLine1: '123 Some Rd',
        addrLine2: null,
        city: 'Lexington',
        country: 'US',
        state: 'KY',
        zipCode: '40404',
        id: 'addy-1'
    }],
    contacts: [{
        id: '1',
        accountId: '1',
        firstName: 'John',
        middleName: 'E',
        lastName: 'Doe',
        workPhone: '800-555-0101',
        alternatePhone: '800-867-5309',
        email: 'john.doe@johndeere.com'
    }],
    devices: [{
        productModel: 'C748DTE NBD',
        serialNumber: '41H0070717001',
        installDate: '6/16/2015',
        ipAddress: '10.141.12.13',
        hostName: 'Hostname',
        id: 'device-1'
    },
    {
        productModel: 'C748DTE NBC',
        serialNumber: '41H0070717002',
        installDate: '7/16/2015',
        ipAddress: '10.141.12.14',
        hostName: 'Hostname2',
        id: 'device-2'
    }],
    requests: [],
    reportGroups: [{
        id: 'group1',
        name: 'Orders'
    },
    {
        id: 'group2',
        name: 'Service'
    },
    {
        id: 'group3',
        name: 'Assets'
    },
    {
        id: 'group4',
        name: 'Summary'
    }],
    reportCategories: [{
        id: '123',
        groupId: 'group1',
        name: 'Asset register',
        desc: 'AM1173 Change Management'
    },
    {
        id:'456',
        groupId: 'group1',
        name: 'Future Rate',
        desc: 'AM1177 Future Rate'
    },
    {
        id:'789',
        groupId: 'group1',
        name: 'FCC Rate',
        desc: 'AM1188 FCC Rate'
    },
    {
        id: '910',
        groupId: 'group2',
        name: 'Asset Retirement Daily',
        desc: 'Asset Retirement Daily'
    },
    {
        id:'911',
        groupId: 'group2',
        name: 'Asset Retirement Weekly',
        desc: 'Asset Retirement Weekly'
    },
    {
        id:'912',
        groupId: 'group3',
        name: 'Missing Page Count - Automated (AM1175)',
        desc: 'Missing Page Count - Automated (AM1175)'
    }],
    reports: [{
        id: 'register1',
        definitionId: '123',
        desc: 'AM1173 Change Management',
        date: '08/08/2015',
        status: 'pending'
    },
    {
        id: 'future1',
        definitionId: '456',
        desc: 'AM1177 Future Rate',
        date: '08/09/2015',
        status: 'pending'
    },
    {
        id: 'fcc1',
        definitionId: '789',
        desc: 'AM1188 FCC Rate',
        date: '08/08/2015',
        status: 'pending'
    },
    {
        id: 'register2',
        definitionId: '123',
        desc: 'AM1173 Change Management',
        date: '08/15/2015',
        status: 'pending'
    }]
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
findByDefinitionId = function(definitionId, fn) {
    var i = 0,
    memCnt = memory['reports'].length,
    reportList = [];

    for (i; i < memCnt; i += 1) {
        if (memory['reports'][i].definitionId === definitionId) {
            reportList.push(memory['reports'][i]);
        }
    }

    return fn(reportList);
};

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
    console.log('inside find by id');
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

router.get('/accounts/1/reports/reportlist/:definitionId', function(req, res) {
    var id;
    console.log('inside find by definition id');
    if (!req.query.definitionId) {
        id = req.params.definitionId;
    } else {
        id = req.query.definitionId;
    }

    if (req.headers.accept.indexOf('json') > -1) {
        findByDefinitionId(id, function(record) {
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
    console.log('req is '+req.body.definitionId);
    req.body.id = Math.random().toString(36).substring(2, 7);
    if (req.body.addName || req.body.firstName || req.body.definitionId) {
        console.log('inside the push section');
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
router.get("/ping", function(req, res){
    res.writeHead(200);
    res.end();
});
router.all('/*', function(req, res, next) {
    var languages = req.headers['accept-language'].split(',').map(function(lang) {
        return lang.split(';')[0];
    });
    res.render(__dirname + '/client/views/index.dot', {
        languages_json: JSON.stringify(languages),
        NEWRELICID: process.env.NEWRELICID,
        config: JSON.stringify({
            idp: { serviceUrl: process.env.IDP_SERVICE_URL,
                   clientId: process.env.IDP_CLIENT_ID,
                   redirectUrl: process.env.REDIRECT_URL },
            portal: { serviceUrl: process.env.PORTAL_API_URL }
        })
    });
});

server.listen(process.env.PORT || 3000, process.env.IP || '0.0.0.0', function() {
    var addr = server.address();
    console.log('Customer Portal server listening at', addr.address + ':' + addr.port);
});
