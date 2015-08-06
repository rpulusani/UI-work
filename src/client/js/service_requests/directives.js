'use strict';
angular.module('mps.serviceRequests')
.directive('addressUpload', function() {
    return {
        restrict: 'E',
        templateUrl: '/js/service_requests/templates/upload.html'
    };
});
