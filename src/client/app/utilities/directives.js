'use strict';
angular.module('mps.utility')
.directive('alertMessage', function() {
    return {
        restrict: 'A',
        templateUrl: '/app/utilities/templates/alerts.html',
    };
});
