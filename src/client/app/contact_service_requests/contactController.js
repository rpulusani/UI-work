define(['angular', 'contact'], function(angular) {
    'use strict';
    angular.module('mps.serviceRequestContacts')
    .controller('ContactController', [
        '$scope',
        '$location',
        'Contacts',
        'ServiceRequestService',
        'translationPlaceHolder',
        function(
            $scope,
            $location,
            Contacts,
            ServiceRequestService,
            translationPlaceHolder
        ) {
            $scope.translationPlaceHolder = translationPlaceHolder;

            $scope.contacts = Contacts;

            if (Contacts.item === null) {
                Contacts.goToList();
            }
        }
    ]);
});
