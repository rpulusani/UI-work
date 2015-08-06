'use strict';
angular.module('mps.serviceRequestAddresses').factory('Addresses', function($http) {
    var Address = function() {
        var addy = this; 
        addy.addresses = [];
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
        return $http.get('/service_requests/addresses/all');
    };
    
    return new Address();
});
