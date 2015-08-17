'use strict';
angular.module('mps.serviceRequestAddresses')
.factory('Addresses', ['$http', 'ServiceRequests', 'BaseService', 
    function($http, ServiceRequests, BaseService) {
    var Address = function() {
        var addy = this;

        addy.currentAddress = {
            addName: '',
            storeName: '',
            addrLine1: '',
            addrLine2: '',
            city: '',
            country: '',
            state: '',
            zipCode: '',
            county: '',
            district:'',
            id: null
        };

        addy.addresses = []; // data store
        addy.hasData = false; // Lets us know if we have a dataset from the server
    };
    Address.prototype = new BaseService();
    Address.prototype.save = function(formdata, fn) {
        $http.post('', formdata, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        }).success(function(res) {
            return fn(res);
        }).error(function(data) {
            NREUM.noticeError(data);
        });
    };

    Address.prototype.getById = function(id, fn) {
        var addy = this;

        $http.get('/service_requests/addresses/' + id).success(function(res) {
            addy.currentAddress = res;
            
            return fn();
        }).error(function(data) {
            NREUM.noticeError(data);
        });
    };

    Address.prototype.deleteById = function(id, fn) {
        var addy = this;

        $http.delete('/service_requests/addresses/' + id).success(function(res) {
            var i = 0,
            addressCnt = addy.addresses.length;

            try{
                for (i; i < addressCnt; i += 1) {
                    if (addy.addresses[i].id === id) {
                        addy.addresses.splice(i, 1);
                    }
                }
            }catch (error){
                if (error instanceof ReferenceError){
                    NREUM.noticeError(error);
                } else if (error instanceof TypeError){
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

    Address.prototype.query = function(fn) {
        var addy = this;

        $http.get('/service_requests/addresses/all').then(function(res) {
            addy.addresses = res.data;
            addy.hasData = true;

            if (typeof fn === 'function') {
                return fn(res.data);
            }
        }).catch(function(data) {
            NREUM.noticeError(data);
        });
    };
    
    return new Address();
}]);
