

angular.module('mps.siebel')
.controller('ManageSiebelValueController', ['$scope', '$location', '$rootScope', 'SiebelValues', '$q', 'FormatterService',
    'BlankCheck', '$http',
    function($scope, $location, $rootScope, SiebelValues, $q, FormatterService, BlankCheck, $http) {
        $scope.siebelInfo = {};
        var redirect_to_list = function() {
           $location.path(SiebelValues.route + '/');
        };

        if (SiebelValues.item === null) {
            redirect_to_list();
        } else {
            $scope.siebel = SiebelValues.item.data;
        }

        $scope.siebelOptions = [
            {key: 'SERVICE_STATUS', name:  'Service Status'},
            {key: 'ENTITLEMENT_SERVICE_DETAILS', name:  'Entitlement Service Detail'},
            {key: 'SERVICE_ACTIVITY_STATUS_DESCRIPTION', name:  'Service Activity Status Description'},
            {key: 'HARDWARE_PAYMENT_TYPE', name:  'Hardware Payment Type'}
        ];


        var updateSiebelObjectForUpdate = function() {
            SiebelValues.newMessage();
            var siebelValues = {"EN": $scope.siebel.values.EN};
            $scope.siebelInfo = SiebelValues.item;
            SiebelValues.addField('key', $scope.siebel.key);
            SiebelValues.addField('type', $scope.siebel.type);
            SiebelValues.addField('module', $scope.siebel.module);
            SiebelValues.addField('subModule', $scope.siebel.subModule);
            SiebelValues.addField('actualValue', $scope.siebel.actualValue);
            SiebelValues.addField('order', $scope.siebel.order);
            SiebelValues.addField('values', siebelValues);
        };

        $scope.update = function() {
            updateSiebelObjectForUpdate();
            SiebelValues.item.postURL = SiebelValues.url + '/' + $scope.siebelInfo.key;
            var options = {
                preventDefaultParams: true
            }
            var deferred = SiebelValues.put({
                item:  $scope.siebelInfo
            }, options);

            deferred.then(function(result){
                $location.path('/siebel');
            }, function(reason){
                NREUM.noticeError('Failed to update Siebel value because: ' + reason);
            });
        };

        $scope.delete = function() {
            $http({
                method: 'DELETE',
                url: SiebelValues.item.url
            }).then(function(response) {
                $location.path('/siebel');
            }, function(response) {
                NREUM.noticeError('Failed to DELETE Siebel value: ' + response.statusText);
            });
        };
    }
]);

