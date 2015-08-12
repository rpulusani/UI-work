'use strict';
angular.module('mps.serviceRequests').factory('ServiceRequests', ['$http', function($http) {
    var ServiceRequest = function() {

    };

    ServiceRequest.prototype.saveAddress = function(address, fn) {

    };

    ServiceRequest.prototype.saveContact = function(address, fn) {
        
    };

    // Pass in an object that defined the request type and request data
    ServiceRequest.prototype.save = function(requestObj, fn) {

    };

    return new ServiceRequest();
}]);
