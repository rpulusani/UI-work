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
    'uiGridExporterConstants',
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
        SRHelper,
        uiGridExporterConstants
    ) {
        var personal = new Personalize($location.url(), $rootScope.idpUser.id),
        filterSearchService = new FilterSearchService(Contacts, $scope, $rootScope, personal);

        SRHelper.addMethods(Contacts, $scope, $rootScope);

        $rootScope.currentRowList = [];

        $scope.contacts = Contacts;

        $scope.print = function(){
            $scope.gridApi.exporter.pdfExport( uiGridExporterConstants.ALL, uiGridExporterConstants.ALL );
        };

        $scope.export = function(){
            var myElement = angular.element(document.querySelectorAll(".custom-csv-link-location"));
            $scope.gridApi.exporter.csvExport( uiGridExporterConstants.ALL, uiGridExporterConstants.ALL, myElement );
        };

        $scope.selectRow = function(btnType) {
            if (btnType !== 'delete') {
                Contacts.goToUpdate($scope.gridApi.selection.getSelectedRows()[0]);
            } else {
                Contacts.goToReview($scope.gridApi.selection.getSelectedRows()[0]);
            }
        };

        $scope.getFullname = function(rowInfo) {
            return formatter.getFullName(rowInfo.firstName, rowInfo.lastName, rowInfo.middleName);
        };

        filterSearchService.addBasicFilter('CONTACT.ALL', false, false,
            function() {
                filterSearchService.addPanelFilter('Filter by Location', 'state', false);

                setTimeout(function() {
                    $scope.$broadcast('setupColumnPicker', new GridService());
                }, 500); // Stupid hack, need to look closely at FSS bit who has the time?
            }
        );
    }]);
});
