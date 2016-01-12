define(['angular', 'contact', 'utility.grid'], function(angular) {
    'use strict';
    angular.module('mps.serviceRequestContacts')
    .controller('ContactListController', ['$scope', '$location', 'grid', 'Contacts', '$rootScope','FormatterService',
        'PersonalizationServiceFactory',
        function($scope, $location, Grid, Contacts, $rootScope, formatter, Personalize) {
            var personal = new Personalize($location.url(), $rootScope.idpUser.id);

            $rootScope.currentRowList = [];

            $scope.goToCreate = function() {
                Contacts.item = {};
                $location.path(Contacts.route + '/new');
            };

            $scope.view = function() {
                console.log('in view');
            }

            $scope.getFullname = function(rowInfo) {
                return formatter.getFullName(rowInfo.firstName, rowInfo.lastName, rowInfo.middleName);
            }

            $scope.goToUpdate = function(contact) {
                Contacts.item = contact;
                $location.path(Contacts.route + '/' + Contacts.item.id + '/update');
            };

            $scope.gridOptions = {};
            $scope.gridOptions.onRegisterApi = Grid.getGridActions($rootScope, Contacts, personal);

            Contacts.getPage().then(function() {
                Grid.display(Contacts, $scope, personal);
                
                $scope.$broadcast('setupColumnPicker', Grid);
            }, function(reason) {
                NREUM.noticeError('Grid Load Failed for ' + Contacts.serviceName +  ' reason: ' + reason);
            });
        }
    ]);
});
