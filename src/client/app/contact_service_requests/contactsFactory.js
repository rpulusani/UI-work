'use strict';
angular.module('mps.serviceRequestContacts').factory('Contacts', ['$http', function($http) {
    var Contact = function() {
        var contact = this;

        contact.contact = null; // Current contact
        contact.contacts = []; // data store
        contact.hasData = false; // Lets us know if we have a dataset from the server
    };

    Contact.prototype.save = function(formdata, fn) {
        var contact = this;

        $http.post('/accounts/1/contacts/', formdata, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        }).success(function(res) {
            contact.contact = res;

            return fn(res);
        }).error(function(data) {
            NREUM.noticeError(data);
        });
    }


    Contact.prototype.update = function(formdata, id, fn) {
        $http.post('/accounts/1/contacts/' + id, formdata, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        }).success(function(res) {
            return fn(res);
        }).error(function(data) {
            NREUM.noticeError(data);
        });
    }

    Contact.prototype.getById = function(id, fn) {
        var contact = this;

        $http.get('/accounts/1/contacts/' + id).success(function(res) {
            contact.contact = res;
            
            return fn();
        }).error(function(data) {
            NREUM.noticeError(data);
        });
    };

    Contact.prototype.removeById = function(id, fn) {
        var contact = this;

        $http.delete('/accounts/1/contacts/' + id).success(function(res) {
            var i = 0,
            contactCnt = contact.contacts.length;

            try {
                for (i; i < contactCnt; i += 1) {
                    if (contact.contacts[i].id === id) {
                        contact.contacts.splice(i, 1);
                    }
                }
            } catch (error) {
                if (error instanceof ReferenceError) {
                    NREUM.noticeError(error);
                } else if (error instanceof TypeError) {
                    NREUM.noticeError(error);
                }
            }

            if (typeof fn === 'function') {
                return fn();
            }
        }).error(function(data) {
            NREUM.noticeError(data);
        });
    };

    Contact.prototype.query = function(fn) {
        var contact = this;

        $http.get('/accounts/1/contacts').then(function(res) {
            contact.contacts = res.data;
            contact.hasData = true;

            if (typeof fn === 'function') {
                return fn(res);
            }
        }).catch(function(data) {
            NREUM.noticeError(data);
        });
    };

    return new Contact();
}]);
