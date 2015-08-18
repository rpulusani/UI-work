'use strict';
angular.module('mps.utility')
.directive('alertMessage', function() {
    return {
        restrict: 'E',
        templateUrl: '/app/utilities/templates/alerts.html',
    };
});
