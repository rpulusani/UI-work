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
    devices: {
        "_links": {
        "self": {
          "href": "http://10.145.116.233:8080/accounts/1/devices",
          "templated": true
        }
      },
      "_embedded": {
        "devices":[
                {
                    productModel: 'C748DTE NBD',
                    serialNumber: '41H0070717001',
                    installDate: '7/15/2015',
                    ipAddress: '10.141.12.12',
                    hostName: 'Hostname1',
                    id: 'device-1'
                },
                {
                    productModel: 'C748DTE NBC',
                    serialNumber: '41H0070717002',
                    installDate: '7/16/2015',
                    ipAddress: '10.141.12.14',
                    hostName: 'Hostname2',
                    id: 'device-2'
                }
            ]
        }
    },
    pageCounts: {
        "_links": {
        "self": {
          "href": "http://10.145.116.233:8080/accounts/1/pageCounts",
          "templated": true
        }
      },
      "_embedded": {
        "pageCounts":[
                {
                    id: 'device-1',
                    devicePageCounts: [
                        {
                            id: 'lifetime-1',
                            count: '170000',
                            updatedDate: '09/01/2015'
                        },
                        {
                            id: 'color-1',
                            count: '27000',
                            updatedDate: '09/02/2015'
                        },
                        {
                            id: 'a3color',
                            count: '47000',
                            updatedDate: '09/03/2015'
                        }
                    ]
                },
                {
                    id: 'device-2',
                    devicePageCounts: [
                        {
                            id: 'lifetime-1',
                            count: '170000',
                            updatedDate: '09/08/2015'
                        },
                        {
                            id: 'mono-1',
                            count: '29000',
                            updatedDate: '09/02/2015'
                        },
                        {
                            id: 'a4color',
                            count: '48000',
                            updatedDate: '09/07/2015'
                        }
                    ]
                }
            ]
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
    },
    reportGroups: {
        "_links": {
        "self": {
          "href": "http://10.145.116.233:8080/accounts/1/reportGroups",
          "templated": true
        }
      },
      "_embedded": {
        "reportGroups":[
                {
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
                }
            ]
        }
    },
    reportCategories: {
        "_links": {
        "self": {
          "href": "http://10.145.116.233:8080/accounts/1/reportCategories",
          "templated": true
        }
      },
      "_embedded": {
        "reportCategories":[
                {
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
                }
            ]
        }
    },
    reports: {
        "_links": {
        "self": {
          "href": "http://10.145.116.233:8080/accounts/1/reportGroups",
          "templated": true
        }
      },
      "_embedded": {
        "reports":[
                {
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
    var localId = id;
    if (id === parseInt(id, 10)) {
        localId = parseInt(id);
    }
    for (i; i < memCnt; i += 1) {
        if (mem[i].id === localId) {
            return fn(mem[i], i);
        }
    }

    return fn(false);
},
findByDefinitionId = function(definitionId, fn) {
    var i = 0,
    mem = memory['reports']._embedded['reports'],
    memCnt = mem.length,
    reportList = [];

    for (i; i < memCnt; i += 1) {
        if (mem[i].definitionId === definitionId) {
            reportList.push(mem[i]);
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
    console.log(memory[req.params.requestType]._embedded[req.params.requestType])
    res.json(memory[req.params.requestType]._embedded[req.params.requestType]);
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
