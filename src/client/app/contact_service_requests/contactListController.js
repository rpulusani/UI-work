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
        GridService,
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

        $scope.selectRow = function(btnType) {
            if (btnType !== 'delete') {
                Contacts.goToUpdate($scope.gridApi.selection.getSelectedRows()[0]);
            } else {
                Contacts.goToReview($scope.gridApi.selection.getSelectedRows()[0]);
            }
        };

        Contacts.alertState = false;

        filterSearchService.addBasicFilter('CONTACT.ALL', undefined, undefined,
            function(Grid) {
                filterSearchService.addPanelFilter('Filter by Location', 'state', false);

                $scope.$broadcast('setupPrintAndExport', $scope);

                setTimeout(function() {
                    $scope.$broadcast('setupColumnPicker', Grid);
                }, 500);
            }
        );
    }]);
});
