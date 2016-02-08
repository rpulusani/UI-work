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
    users:
        {
  "_links": {
    "self": {
      "href": "http://10.145.116.233:8080/users"
    }
  },
  "_embedded": {
    "users": [
              {
                "id": "122345",
                "userId": "122345",
                "idpId": "122345",
                "contactId": "122345",
                "type": "enduser",
                "created": "01/26/2015 00:00:00",
                "createdBy": "12342",
                "updated": "01/26/2015 00:00:00",
                "updatedBy": "12342",
                "invitedStatus": "pending",
                "activeStatus": "Y",
                "resetPassword": "Y",
                "firstName": "shankar",
                "lastName": "matta",
                "email": "test@test.com",
                "password": "tbd",
                "workPhone": "111-11-1111",
                "address1": "111-11-1111",
                "address2": "111-11-1111",
                "city": "lexington",
                "country": "usa",
                "state": "ky",
                "postalCode": "40509",
                "preferredLanguage": "en_US",
                "permissions": [
                  "viewInvoices"
                ],
                "_links": {
                  "self": {
                    "href": "/users/{userId}"
                  },
                  "accounts": [
                    {
                      "href": "/accounts/123"
                    }
                  ],
                  "roles": [
                    {
                      "href": "/roles/123"
                    }
                  ],
                  "contact": {
                    "href": "/contacts/122345"
                  }
                },
                "_embedded": {
                  "accounts": [
                    {
                      "name": "string",
                      "id": 0,
                      "additionalProperties": "tbd"
                    }
                  ],
                  "roles": [
                    {
                      "roleId": "122345",
                      "description": "account manager",
                      "permissions": [
                        "viewInvoices"
                      ],
                      "_links": {
                        "self": {
                          "href": "/roles/CustomerPortal/2"
                        }
                      }
                    }
                  ],
                  "preferences": [
                    "SEND EMAIL ETC"
                  ]
                }
              },
              {
                "id": "1223456",
                "userId": "1223456",
                "idpId": "1223456",
                "contactId": "1223456",
                "type": "INVITED",
                "created": "01/26/2015 00:00:00",
                "createdBy": "12342",
                "updated": "01/26/2015 00:00:00",
                "updatedBy": "12342",
                "invitedStatus": "pending",
                "activeStatus": "Y",
                "resetPassword": "Y",
                "firstName": "test",
                "lastName": "user",
                "email": "test@user.com",
                "password": "tbd",
                "workPhone": "111-11-1111",
                "address1": "111-11-1111",
                "address2": "111-11-1111",
                "city": "lexington",
                "country": "usa",
                "state": "ky",
                "postalCode": "40509",
                "preferredLanguage": "en_US",
                "permissions": [
                  "viewInvoices"
                ],
                "_links": {
                  "self": {
                    "href": "/users/1223456"
                  },
                  "accounts": [
                    {
                      "href": "/accounts/123"
                    }
                  ],
                  "roles": [
                    {
                      "href": "/roles/123"
                    }
                  ],
                  "contact": {
                    "href": "/contacts/122345"
                  }
                },
                "_embedded": {
                  "accounts": [
                    {
                      "name": "Test Account",
                      "id": 0,
                      "additionalProperties": "tbd"
                    }
                  ],
                  "roles": [
                    {
                      "roleId": "122345",
                      "description": "account manager",
                      "permissions": [
                        "viewInvoices"
                      ],
                      "_links": {
                        "self": {
                          "href": "/roles/CustomerPortal/2"
                        }
                      }
                    }
                  ],
                  "preferences": [
                    "SEND EMAIL ETC"
                  ]
                }
              },
              {
                "id": "1223457",
                "userId": "1223457",
                "idpId": "1223457",
                "contactId": "1223457",
                "type": "enduser",
                "created": "01/26/2015 00:00:00",
                "createdBy": "12342",
                "updated": "01/26/2015 00:00:00",
                "updatedBy": "12342",
                "invitedStatus": "pending",
                "activeStatus": "Y",
                "resetPassword": "Y",
                "firstName": "test",
                "lastName": "user2",
                "email": "test2@user.com",
                "password": "tbd",
                "workPhone": "111-11-1111",
                "address1": "111-11-1111",
                "address2": "111-11-1111",
                "city": "lexington",
                "country": "usa",
                "state": "ky",
                "postalCode": "40509",
                "preferredLanguage": "en_US",
                "permissions": [
                  "viewInvoices"
                ],
                "_links": {
                  "self": {
                    "href": "/users/1223456"
                  },
                  "accounts": [
                    {
                      "href": "/accounts/123"
                    }
                  ],
                  "roles": [
                    {
                      "href": "/roles/123"
                    }
                  ],
                  "contact": {
                    "href": "/contacts/122345"
                  }
                },
                "_embedded": {
                  "accounts": [
                    {
                      "name": "Test Account",
                      "id": 0,
                      "additionalProperties": "tbd"
                    }
                  ],
                  "roles": [
                    {
                      "roleId": "122345",
                      "description": "account manager",
                      "permissions": [
                        "viewInvoices"
                      ],
                      "_links": {
                        "self": {
                          "href": "/roles/CustomerPortal/2"
                        }
                      }
                    }
                  ],
                  "preferences": [
                    "SEND EMAIL ETC"
                  ]
                }
              }
            ]
          },
          "page": {
            "size": 20,
            "totalElements": 3,
            "totalPages": 1,
            "number": 0
          }
        },

    reportTypes: {
      "_links": {
        "self": {
          "href": "/mps/reports/types"
        }
      },
      "_embedded": {
        "types": [
            {
                id: '123',
                name: 'Asset register',
                      "_links": {
                        "self": {
                          "href": "/reports/type/123"
                        }
                      }
            },
            {
                id:'913',
                name: 'MADC',
                eventTypes: [{id: 1, value: 'Remove - Account'}, {id: 2, value: 'MC'}, {id: 3, value: 'Installs'}, {id: 4, value: 'Manual Swaps'}],
                      "_links": {
                        "self": {
                          "href": "/reports/type/123"
                        }
                      }
            },
            {
                id:'456',
                name: 'Missing Meter Reads',
                      "_links": {
                        "self": {
                          "href": "/reports/type/123"
                        }
                      }
            },
            {
                id:'789',
                name: 'Consumables Orders',
                      "_links": {
                        "self": {
                          "href": "/reports/type/123"
                        }
                      }
            },
            {
                id: '910',
                name: 'Hardware Orders',
                      "_links": {
                        "self": {
                          "href": "/reports/type/123"
                        }
                      }
            },
            {
                id: '911',
                name: 'Pages Billed',
                      "_links": {
                        "self": {
                          "href": "/reports/type/123"
                        }
                      }
            },
            {
                id:'912',
                name: 'Hardware Installation Requests',
                      "_links": {
                        "self": {
                          "href": "/reports/type/123"
                        }
                      }
            },
            {
                id:'914',
                name: 'Service Detail Report',
                      "_links": {
                        "self": {
                          "href": "/reports/type/123"
                        }
                      }
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
findByInvited = function(fn) {
    var i = 0,
    mem = memory['users']._embedded['users'],
    memCnt = mem.length,
    userList = [];

    for (i; i < memCnt; i += 1) {
        if (mem[i].type === 'INVITED') {
            userList.push(mem[i]);
        }
    }

    return fn(userList);
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

router.get('/reports/types', function(req, res) {
    res.json(memory.reportTypes);
});

router.get('/countries', function(req, res) {
    res.json(memory.countries);
});

router.get('/users', function(req, res) {
    console.log('inside normal users');
    console.log(JSON.stringify(req.query));
    if (req.query !== undefined && JSON.stringify(req.query).indexOf('type') > 0) {
        findByInvited(function(record) {
            if (record) {
                var userTextBegin = '{"_links": {"self": {"href": "http://10.145.116.233:8080/users"}},"_embedded": {"users":';
                var recordList = JSON.stringify(record);
                var userTextEnd = '},"page": {"size": 20,"totalElements": 1,"totalPages": 1,"number": 0}}';
                var recordToSend = userTextBegin + recordList + userTextEnd;
                console.log(recordToSend);
                var jsonRecord = JSON.parse(recordToSend);
                console.log(jsonRecord);
                res.json(jsonRecord);
            } else {
                res.send(400);
            }
        });
    } else {
      res.json(memory['users']);
    }

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
            portal: { serviceUrl: process.env.PORTAL_API_URL,
                      lbsUrl: process.env.LBS_URL,
                      libraryServiceUrl: process.env.LIBRARY_API_URL  }
        })
    });
});

server.listen(process.env.PORT || 3000, process.env.IP || '0.0.0.0', function() {
    var addr = server.address();
    console.log('Customer Portal server listening at', addr.address + ':' + addr.port);
});
