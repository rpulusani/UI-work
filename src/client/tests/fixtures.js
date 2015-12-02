define([], function() {
    var fixtures = {};

    /* HATEOAS Service Mock Data Structures */
    fixtures.api = {
        test: {}
    };

    fixtures.api.initalApiCall = {
        _links : {
            test: {
              href :  "http://127.0.0.1/test{?page,size,sort}",
              templated : true
            },
            fooBarService: {
                href : "http://127.0.0.1/anotherTest{?page,size,sort,testParam}",
                templated : true
            }
        }
    };

    fixtures.api.test.itemOne = {
        "name" : "test",
        "id" : "itemOne",
        "_links" : {
            "self" : {
                "href" : 'http://127.0.0.1/test/itemOne'
            }
        }
    };

    fixtures.api.test.itemTwo = {
        "name" : "test2",
        "id" : 'itemTwo',
        "saved": true,
        "_links" : {
            "self" : {
                "href" : 'http://127.0.0.1/test/itemTwo'
            }
        }
    };

    fixtures.api.test.embedItem = {
        "name" : "test2",
        "id" : "1-EMBED",
        "saved": true,
        "_embedded": {
            'device': {
                "name": "testDevice",
                "_links" : {
                    "self" : {
                        "href" : "http://127.0.0.1/device/1-DEVICE"
                    }
                }
            }
        },
        "_links" : {
            "self" : {
                "href" : "http://127.0.0.1/test/1-EMBED"
            }
        }
    };

    fixtures.api.test.pageOne = {
        "_links" : {
            "self" : {
                "href" : 'http://127.0.0.1/test{?page,size,sort}',
                "templated" : true
            },
            "next" : {
                "href" : 'http://127.0.0.1/test?page=1&size=20{&sort}',
                "templated" : true
            }
        },
        "_embedded" : {
            "test" : [ fixtures.api.test.itemOne ]
        },
        "page" : {
            "size" : 1,
            "totalElements" : 3,
            "totalPages" : 2,
            "number" : 0
        }
    };

    fixtures.api.test.pageTwo = {
        "_links" : {
            "self" : {
                "href" : 'http://127.0.0.1/test{?page,size,sort}',
                "templated" : true
            },
            "next" : {
                "href" :  'http://127.0.0.1/test?page=1&size=20{&sort}',
                "templated" : true
            }
        },
        "_embedded" : {
            "test" : [ fixtures.api.test.itemOne, fixtures.api.test.itemTwo ]
        },
        "page" : {
            "size" : 2,
            "totalElements" : 3,
            "totalPages" : 2,
            "number" : 1
        }
    };

    /* User Mock Data Structures */
    fixtures.users = {};
    fixtures.users.regular = {
        item: {
            accounts: [
                {
                    accountId: '1-21AYVOT',
                    accountLevel: 'GLOBAL'
                }
            ],
            "_links" : {
                "self" : {
                    "href" : 'http://127.0.0.1/test{?page,size,sort}'
                },
                "contact" : {
                    "href" : 'http://127.0.0.1/contact{?page,size,sort}'
                }
            }
        }
       
    };

    fixtures.devices = {};
    fixtures.devices.regular = {
        "serialNumber": "406336990F9Y5",
        "address": {
            "item": {
                "addressLine1":"123"
            }
        },
        "contact": {
            "item": {
                "firstName":"testName"
            }
        },
        "_embeddedItems": {
            "address": {
              "name": "Walmart Chile Comercial Limitada",
              "id": "1-CMP8BEW"
            },
            "primaryContact": {
              "firstName": "TAMARA"
            }
        },
        "_links" : {
            "self" : {
                "href" : 'http://127.0.0.1/test/1-ACCT-ID'
            },
            "meterReads": {
              "href": 'http://127.0.0.1/test/1-ACCT-ID/meter-reads'
            }
        }
    };

    return fixtures;
});
