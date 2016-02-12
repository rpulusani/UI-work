define(['angular','contact'], function(angular) {
    'use strict';
    angular.module('mps.serviceRequestContacts')
    .controller('ContactUpdateTabController', [
        '$rootScope',
        '$scope',
        'SecurityHelper',
        function(
            $rootScope,
            $scope,
            SecurityHelper
        ) {
            //new SecurityHelper($rootScope).redirectCheck($rootScope.orderAccess);

            $scope.originalContact = angular.copy($scope.contact);
            $scope.originalAddress = angular.copy($scope.contact.address);
            $rootScope.updatedContactInfo = false;
            $rootScope.updatedContactAddress = false;

            $scope.contactValuesChanged = function(){
                if($scope.contact.firstName !== $scope.originalContact.firstName ||
                    $scope.contact.middleName !== $scope.originalContact.middleName ||
                    $scope.contact.lastName !== $scope.originalContact.lastName ||
                    $scope.contact.email !== $scope.originalContact.email ||
                    $scope.contact.workPhone !== $scope.originalContact.workPhone){
                        $rootScope.updatedContactInfo = true;
                }
            };

            $scope.addressValuesChanged = function(){
                if($scope.contact.address.addressLine1 !== $scope.originalAddress.addressLine1 ||
                    $scope.contact.address.addressLine2 !== $scope.originalAddress.addressLine2 ||
                    $scope.contact.address.city !== $scope.originalAddress.city ||
                    $scope.contact.address.state !== $scope.originalAddress.state ||
                    $scope.contact.address.postalCode !== $scope.originalAddress.postalCode){
                        $rootScope.updatedContactAddress = true;
                    }
            };

            $scope.checkTab = function(value){
                $scope.contactValuesChanged();
                $scope.addressValuesChanged();
            };

            $scope.active = function(value){
                $rootScope.updatedContactInfo = false;
                $rootScope.updatedContactAddress = false;
                $scope.checkTab();
                $rootScope.serviceTabSelected = value;
            };

            $scope.isActive = function(value){
                var passed = false;
                if($rootScope.serviceTabSelected === value){
                    passed = true;
                }
                return passed;
            };

            $scope.active('contactInfoTab');

            
        }
    ]);
});
