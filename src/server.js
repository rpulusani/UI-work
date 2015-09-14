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
    addresses: {
      "_links": {
        "self": {
          "href": "http://10.145.116.233:8080/accounts/1/addresses",
          "templated": true
        }
      },
      "_embedded": {
        "addresses": [
         {
            "id": 1,
            "name": "Address Name Test",
            "storeFrontName": "Store Front Name",
            "addressLine1": "Address 1",
            "addressLine2": "",
            "city": "Lexington",
            "state": {
                "name": "Kansas",
                "code": "KS"
            },
            "stateCode": "KY",
            "province": "",
            "county": "Fayette",
            "countyIsoCode": "",
            "district": "",
            "country": {
                "name": "USA",
                "code": "US"
            },
            "postalCode": "",
            "siteId": "",
            "siteName": "",
            "buildingId": "",
            "buildingName": "",
            "floorId": "",
            "floorName": "",
            "zoneId": "",
            "zoneName": "",
            "lbsIndentifierFlag": true,
            "region": "",
            "latitude": "",
            "longitude": "",
            "lbsGridX": "",
            "lbsGridY": "",
            "_links": {
              "self": {
                "href": "http://10.145.116.233:8080/mps/accounts/1/addresses/1"
              }
            }
          }
        ]
      },
      "page": {
        "size": 20,
        "totalElements": 2,
        "totalPages": 1,
        "number": 0
      }
    },
    requests: [],
    contacts: {
      "_links": {
        "self": {
          "href": "http://10.145.116.233:8080/accounts/1/contacts",
          "templated": true
        }
      },
      "_embedded": {
        "contacts": [
          {
            "id": 1,
            "firstName": "Arnold",
            "middleName": "M",
            "lastName": "Schwarzenegger",
            "email": "terminator@sky.net",
            "workPhone": "(555) 555-5555",
            "alternatePhone": "(111) 111-1111",
            "department": "Web",
            "type": "?",
            "userFavorite": false,
            "_links": {
              "self": {
                "href": "http://10.145.116.233:8080/mps/accounts/1/contacts/1"
              },
              "account": {
                "href": "http://10.145.116.233:8080/mps/accounts/1"
              }
            }
          },
          {
            "id": 2,
            "firstName": "Andrew",
            "middleName": "Ender",
            "lastName": "Wiggin",
            "email": "andrew@fleet.net",
            "workPhone": "(555) 555-5555",
            "alternatePhone": "(111) 111-1111",
            "department": "Web",
            "type": "?",
            "userFavorite": false,
            "_links": {
              "self": {
                "href": "http://10.145.116.233:8080/mps/accounts/1/contacts/2"
              },
              "account": {
                "href": "http://10.145.116.233:8080/mps/accounts/1"
              }
            }
          }
        ]
      },
      "page": {
        "size": 20,
        "totalElements": 2,
        "totalPages": 1,
        "number": 0
      }
    },
    countries: {
      "_links": {
        "self": {
          "href": "/mps/countries"
        }
      },
      "_embedded": {
        "countries": [
          {
            "name": "USA",
            "code": "US",
            "provinces": [
              {
                "name": "Kansas",
                "code": "KS"
              },
              {
                "name": "Kentucky",
                "code": "KY"
              }
            ]
          },
          {
            "name": "Canada",
            "code": "CA",
            "provinces": [
              {
                "name": "Ontario",
                "code": "ON"
              },
              {
                "name": "Quebec",
                "code": "QC"
              }
            ]
          },
          {
            "name": "Mexico",
            "code": "MX",
            "provinces": [
              {
                "name": "Chihuahua",
                "code": "CHH"
              }
            ]
          }
        ]
      }
    }
},
addToMemory = function(memType, data, fn) {
   return fn(memory[memType]._embedded[memType].push(data));
},
removeById = function(memType, id, fn) {
    var i = 0,
    mem = memory[memType]._embedded[memType],
    memCnt = mem.length;

    for (i; i < memCnt; i += 1) {
        if (mem[i].id === parseInt(id)) {
            mem.splice(i, 1);

            return fn(true);
        }
    }

    return fn(false);
},
findById = function(memType, id, fn) {
    var i = 0,
    mem = memory[memType]._embedded[memType],
    memCnt = mem.length;

    for (i; i < memCnt; i += 1) {
        if (mem[i].id === parseInt(id)) {
            return fn(mem[i], i);
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

router.get('/countries', function(req, res) {
    res.json(memory.countries);
});

router.get('/accounts/:accountId/:requestType', function(req, res) {
    console.log('All ' + req.params.requestType + ' Sent to client');

    res.json(memory[req.params.requestType]);
});

router.get('/accounts/:accountId/:requestType/new', function(req, res) {
    res.render(__dirname + '/client/views/index.dot', { NEWRELICID: process.env.NEWRELICID });
});

router.get('/accounts/:accountId/:requestType/:id', function(req, res) {
    var id;

    if (!req.query.id) {
        id = req.params.id;
    } else {
        id = req.query.id;
    }

    console.log('Locating ' + req.params.requestType + ' by ID: ' + id);

    if (req.headers.accept.indexOf('application') > -1) {
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

router.get('/accounts/:accountId/reports/reportlist/:definitionId', function(req, res) {
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

router.post('/accounts/:accountId/:requestType', function(req, res) {
    if (typeof req.files !== 'undefined' && req.files.file) {
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

    addToMemory(req.params.requestType, req.body, function() {
        console.log(req.params.requestType + ' Saved');

        res.json(req.body);
    });
});

router.put('/accounts/:accountId/:requestType/:id', function(req, res) {
    findById(req.params.requestType, req.params.id, function(record, recordIndex) {
        var prop; // looping through existing entries properties to update

        for (prop in req.body) {
            record[prop] = req.body[prop];
        }

        console.log(req.params.requestType + ' Updated!');

        res.json(record);
    });
});

router.delete('/accounts/:accountId/:requestType/:id', function(req, res) {
    removeById(req.params.requestType, req.params.id, function(deleted) {
        console.log(req.params.id + ' was deleted!');
        res.json(memory[req.params.requestType]);
    });
});

router.get('/ping', function(req, res){
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
                   clientId: process.env.IDP_CLIENT_ID },
            portal: { serviceUrl: process.env.PORTAL_API_URL }
        })
    });
});

server.listen(process.env.PORT || 3000, process.env.IP || '0.0.0.0', function() {
    var addr = server.address();
    console.log('Customer Portal server listening at', addr.address + ':' + addr.port);
});
