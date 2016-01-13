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
    'SRControllerHelperService',
    function(
        $scope,
        $location,
        Grid,
        Contacts,
        $rootScope,
        Personalize,
        FilterSearchService,
        SecurityHelper,
        formatter,
        SRHelper
    ) {
        var personal = new Personalize($location.url(), $rootScope.idpUser.id),
        filterSearchService = new FilterSearchService(Contacts, $scope, $rootScope, personal);

        SRHelper.addMethods(Contacts, $scope, $rootScope);

        $rootScope.currentRowList = [];

        $scope.contacts = Contacts;

        $scope.getFullname = function(rowInfo) {
            return formatter.getFullName(rowInfo.firstName, rowInfo.lastName, rowInfo.middleName);
        }

        filterSearchService.addBasicFilter('CONTACT.ALL', false,
            function() {
                
                filterSearchService.addPanelFilter('Filter by Location', 'state');

                setTimeout(function() {
                    $scope.$broadcast('setupColumnPicker', Grid);
                }, 0);
            }
        );
    }]); // End Controller
});
