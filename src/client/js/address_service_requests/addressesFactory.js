'use strict';
angular.module('mps.serviceRequestAddresses').factory('Addresses', function($http) {
    var Address = function() {
        var addy = this;
        addy.addresses = []; // data store
        addy.hasData = false; // Lets us know if we have a dataset from the server
    };

    Address.prototype.save = function(formdata, fn) {
        $http.post('', formdata, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        }).success(function(res) {
            return fn(res)
        });
    }

    Address.prototype.deleteById = function(id, fn) {
        $http.delete('/service_requests/addresses/' + id).success(function(res) {
            return fn();
        });
    };

    Address.prototype.query = function(fn) {
        var addy = this;

        $http.get('/service_requests/addresses/all').then(function(res) {
            addy.addresses = res.data;
            addy.hasData = true;

            if (typeof fn === 'function') {
                return fn(res);
            }
        });
    };
    
    return new Address();
});
