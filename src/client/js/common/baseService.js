angular.module('mps.common')
.factory('BaseService', ['$http', function($http) {
    BaseService = function() {

    };

    BaseService.prototype.getCurrentLocation = {
        getPathName: function () {
            return window.location.pathname;
        }
    };

    BaseService.prototype.history = {
        back: function () {
            return window.history.back();
        }
    };

    return BaseService;
}]);
