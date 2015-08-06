'use strict';
angular.module('mps.serviceRequestContacts').factory('Contacts', function($http) {
    var Contact = function() {
        var contact = this;
        contact.contacts = []; // data store
        contact.hasData = false; // Lets us know if we have a dataset from the server
    };

    Contact.prototype.save = function(formdata, fn) {
        $http.post('', formdata, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        }).success(function(res) {
            return fn(res)
        });
    }

    Contact.prototype.deleteById = function(id, fn) {
        $http.delete('/service_requests/contacts/' + id).success(function(res) {
            return fn();
        });
    };

    Contact.prototype.query = function(fn) {
        var contact = this;

        $http.get('/service_requests/contacts/all').then(function(res) {
            contact.contacts = res.data;
            contact.hasData = true;

            if (typeof fn === 'function') {
                return fn(res);
            }
        });
    };
    
    return new Contact();
});
