'use strict';
angular.module('mps.serviceRequests')
.directive('primaryRequestContact', function() {
    return {
        restrict: 'A',
        templateUrl: '/app/service_requests/templates/primary-request-contact.html'
    };
})
.directive('additionalRequestInfo', function() {
    return {
        restrict: 'A',
        templateUrl: '/app/service_requests/templates/additional-request-info.html'
    };
})
.directive('addressUpload', function() {
    return {
        restrict: 'A',
        templateUrl: '/app/service_requests/templates/address-upload.html',
        controller: ['$scope', function($scope) {
            $scope.file_list = ['.csv', '.xls', '.xlsx', '.vsd', '.doc',
                                '.docx', '.ppt', '.pptx', '.pdf', '.zip'].join(',');
        }]
    };
});
