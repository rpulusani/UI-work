define(['angular', 'address'], function(angular) {
    'use strict';
    angular.module('mps.serviceRequestAddresses')
    .factory('Addresses', ['$http', 'ServiceRequestService',
    function($http, ServiceRequestService){
        var Address = function() {
            var addy = this;

            addy.master = { id:0 };
            addy.address = null;

            addy.addresses = []; // data store
        };

        Address.prototype.new = function(){
            var addy = this;
            addy.address = angular.copy({ id:0 });
       };

        Address.prototype.save = function(formdata, fn) {
            var addy = this;

            $http.post('/accounts/1/addresses/', formdata, {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            }).success(function(res) {
                addy.address = res;

                return fn(res);
            }).error(function(data) {
                NREUM.noticeError(data);
            });
        };


        Address.prototype.update = function(formdata, id, fn) {
            $http.post('/accounts/1/addresses/' + id, formdata, {
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

            function addressAPIGetById(id,fn){
                $http.get('/accounts/1/addresses/' + id).success(function(res) {
                    addy.address = res;
                    return fn();
                }).error(function(data) {
                    NREUM.noticeError(data);
                });
            }

            if(id !== undefined && id !== null && id !== "0" && id !== 0){

                    var length = addy.addresses.length,
                    localAddresses = addy.addresses;
                    for(var i = 0; i < length; ++i){
                        if(id === localAddresses[i].id){
                            addy.address = localAddresses[i];
                            return fn();
                        }
                    }
                addressAPIGetById(id, fn);
            } else if(id === "0" || id === 0){
                //in the process of creating a new record do nothing for now
                //don't get from local datastore or network datastore
                return fn();
            } else{
                addressAPIGetById(id, fn);
            }
        };

        Address.prototype.removeById = function(id, fn) {
            var addy = this;

            $http['delete']('/accounts/1/addresses/' + id).success(function(res) {
                var i = 0,
                addressCnt = addy.addresses.length;

                try {
                    for (i; i < addressCnt; i += 1) {
                        if (addy.addresses[i].id === id) {
                            addy.addresses.splice(i, 1);
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

        Address.prototype.query = function(fn) {
            var addy = this;

            $http.get('/accounts/1/addresses').then(function(res) {
                addy.addresses = res.data;

                if (typeof fn === 'function') {
                    return fn(res.data);
                }
            })['catch'](function(data) {
                NREUM.noticeError(data);
            });
        };

        return new Address();
    }]);
});
