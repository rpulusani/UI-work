

angular.module('mps.siebel')
.controller('CreateSiebelValueController', ['$scope', '$location', '$rootScope', 'SiebelValues', '$q', 'FormatterService', 'BlankCheck',
    function($scope, $location, $rootScope, SiebelValues, $q, FormatterService, BlankCheck) {
        $scope.siebelInfo = {};

        $scope.siebelOptions = [
            {key: 'SERVICE_STATUS', name:  'Service Status'},
            {key: 'ENTITLEMENT_SERVICE_DETAILS', name:  'Entitlement Service Detail'},
            {key: 'SERVICE_ACTIVITY_STATUS_DESCRIPTION', name:  'Service Activity Status Description'},
            {key: 'HARDWARE_PAYMENT_TYPE', name:  'Hardware Payment Type'}
        ];

        var updateSiebelObjectForSubmit = function() {
            SiebelValues.newMessage();
            var siebelValues = {"EN": $scope.siebel.values.EN};
            $scope.siebelInfo = SiebelValues.item;
            SiebelValues.addField('key', 'SIEBEL_' + $scope.siebel.subModule +'_' + $scope.siebel.actualValue);
            SiebelValues.addField('type', 'SIEBEL');
            SiebelValues.addField('module', 'SIEBEL');
            SiebelValues.addField('subModule', $scope.siebel.subModule);
            SiebelValues.addField('actualValue', $scope.siebel.actualValue);
            SiebelValues.addField('order', $scope.siebel.order);
            SiebelValues.addField('values', siebelValues);
        };

        $scope.save = function() {
            updateSiebelObjectForSubmit();
            SiebelValues.item.postURL = SiebelValues.url;
            var deferred = SiebelValues.post({
                item:  $scope.siebelInfo
            });

            deferred.then(function(result){
                $location.path('/siebel');
            }, function(reason){
                NREUM.noticeError('Failed to create siebel value because: ' + reason);
            });
        };
    }
]);
