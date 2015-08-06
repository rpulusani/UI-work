angular.module('mps')
.factory('BaseService', ['$http', function($http) {
    BaseService = function() {

    };

    BaseService.prototype.getCurrentLocation = {
        getPathName: function () {
            return window.location.pathname;
        }
    };
    return BaseService;
}]);
