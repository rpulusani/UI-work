define(['angular', 'contact', 'utility.grid'], function(angular) {
    'use strict';
    angular.module('mps.serviceRequestContacts')
    .controller('ContactListController', [
    '$scope',
    '$location',
    'grid',
    'Contacts',
    '$rootScope',
    'PersonalizationServiceFactory',
    'FilterSearchService',
    'SecurityHelper',
    'FormatterService',
    function(
        $scope,
        $location,
        Grid,
        Contacts,
        $rootScope,
        Personalize,
        FilterSearchService,
        SecurityHelper,
        formatter
    ) {
        var personal = new Personalize($location.url(), $rootScope.idpUser.id),
        filterSearchService = new FilterSearchService(Contacts, $scope, $rootScope, personal);

        $rootScope.currentRowList = [];

        $scope.goToCreate = function() {
            Contacts.item = {};
            $location.path(Contacts.route + '/new');
        };

        $scope.goToUpdate = function(contact) {
            Contacts.item = contact;
            $location.path(Contacts.route + '/' + Contacts.item.id + '/update');
        };

        $scope.getFullname = function(rowInfo) {
            return formatter.getFullName(rowInfo.firstName, rowInfo.lastName, rowInfo.middleName);
        }

        filterSearchService.addBasicFilter('CONTACT.ALL', false,
            function() {
                $scope.$broadcast('setupColumnPicker', Grid);
            }
        );
    }]); // End Controller
});
