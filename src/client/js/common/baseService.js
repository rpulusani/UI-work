angular.module('mps.common')
.factory('BaseService', ['$http', function($http) {
    BaseService = function() {

    };

    BaseService.prototype.history = {
        back: function () {
            return window.history.back();
        }
    };

    return BaseService;
}]);
