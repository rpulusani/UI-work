

angular.module('mps.siebel')
.controller('ManageTranslationController', ['$scope', '$location', '$rootScope', 'Translations', '$q', 'FormatterService',
    'BlankCheck', '$http',
    function($scope, $location, $rootScope, Translations, $q, FormatterService, BlankCheck, $http) {
        $scope.siebelInfo = {};
        $scope.siebelFlag = false;
        $scope.portalFlag = false;
        $scope.documentFlag = false;
        $scope.notificationFlag = false;

        var redirect_to_list = function() {
           $location.path(Translations.route + '/');
        };

        if (Translations.item === null) {
            redirect_to_list();
        } else {
            $scope.translation = Translations.item.data;
            if ($scope.translation.type === 'PORTAL_UI') {
                $scope.portalFlag = true;
            } else if ($scope.translation.type === 'SIEBEL') {
                $scope.siebelFlag = true;
            } else if ($scope.translation.type === 'NOTIFICATION') {
                $scope.notificationFlag = true;
            } else {
                $scope.documentFlag = true;
            }
        }

        var updateTranslationObjectForUpdate = function() {
            Translations.newMessage();
            $scope.translationInfo = Translations.item;
            Translations.addField('key', $scope.translation.key);
            Translations.addField('type', $scope.translation.type);
            Translations.addField('module', $scope.translation.module);
            Translations.addField('subModule', $scope.translation.subModule);
            Translations.addField('actualValue', $scope.translation.actualValue);
            Translations.addField('values', $scope.translation.values);
            if($scope.translation.type === 'NOTIFICATION'){
            	Translations.addField('startDate', $scope.translation.startDate);
                Translations.addField('endDate', $scope.translation.endDate);	
            }
            
        };

        $scope.isLoading=false;

        $scope.update = function() {
            $scope.isLoading=true;
            updateTranslationObjectForUpdate();
            Translations.item.postURL = Translations.url + '/' + $scope.translationInfo.key + '?module=' + $scope.translationInfo.module + '&subModule=' + $scope.translationInfo.subModule;
            var options = {
                preventDefaultParams: true
            }
            var deferred = Translations.put({
                item:  $scope.translationInfo
            }, options);

            deferred.then(function(result){
                $location.path('/translations');
            }, function(reason){
                NREUM.noticeError('Failed to update translation because: ' + reason);
            });
        };
    }
]);

