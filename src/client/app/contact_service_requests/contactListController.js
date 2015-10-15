define(['angular', 'contact', 'utility.grid'], function(angular) {
    'use strict';
    angular.module('mps.serviceRequestContacts')
    .controller('ContactListController', ['$scope', '$location', 'grid', 'Contacts', '$rootScope',
        function($scope, $location, Grid, Contacts, $rootScope) {
            $rootScope.currentRowList = [];
            $scope.goToCreate = function() {
                Contacts.item = {};
                $location.path(Contacts.route + '/new');
            };

            $scope.goToUpdate = function(contact) {
                Contacts.get(contact).then(function() {
                    $location.path(Contacts.route + '/' + contact.id + '/update');
                });
            };

            $scope.bookmark = function(contact) {};

            $scope.gridOptions = {};
            $scope.gridOptions.onRegisterApi = Grid.getGridActions($rootScope, Contacts);
            Contacts.getList().then(function() {
                Grid.display(Contacts, $scope);
            }, function(reason) {
                NREUM.noticeError('Grid Load Failed for ' + Contacts.serviceName +  ' reason: ' + reason);
            });
        }
    ]);
});
