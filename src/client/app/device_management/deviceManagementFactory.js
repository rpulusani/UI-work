'use strict';
angular.module('mps.deviceManagement')
.factory('Device', ['$http', function($http) {
    var Device = function() {
        var device = this;
        device.device = null;
        device.devices = []; // data store
    };

    Device.prototype.getById = function(id, fn) {
        var device = this;

        if(id !== undefined && id !== null && id !== "0" && id !== 0){
                var length = device.devices.length,
                localDevices = device.devices;
                for(var i = 0; i < length; ++i){
                    if(id === localDevices[i].id){
                        device.device = localDevices[i];
                        return fn();
                    }
                }
        } else if(id === "0" || id === 0){
            //in the process of creating a new record do nothing for now
            //don't get from local datastore or network datastore
            return fn();
        } else{
            $http.get('/accounts/1/devices/' + id).success(function(res) {
                device.device = res;
                return fn();
            }).error(function(data) {
                NREUM.noticeError(data);
           });
        }
    };    

    Device.prototype.query = function(fn) {
        var device = this;

        $http.get('/accounts/1/devices').then(function(res) {
            device.devices = res.data;

            if (typeof fn === 'function') {
                return fn(res.data);
            }
        })['catch'](function(data) {
            NREUM.noticeError(data);
        });
    };

    return new Device();
}]);
