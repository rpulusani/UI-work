define(['angular', 'utility'], function(angular) {
    'use strict';
    angular.module('mps.utility')
    .factory('History', ['$window', function($window) {
        var History = function() {

        };

        History.prototype.back = function() {
            return $window.history.back();
        };

        return new History();
    }]);
});
