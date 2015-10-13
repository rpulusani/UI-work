define(['angular', 'contact', 'utility.gridService'], function(angular) {
    'use strict';
    angular.module('mps.serviceRequestContacts')
    .controller('ContactListController', ['$scope', '$location', 'grid', 'Contacts',
        function($scope, $location, Grid, Contacts) {
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
             $scope.gridOptions.onRegisterApi = GridService.getGridActions($rootScope, Contacts);
            Contacts.getList().then(function() {
                Grid.display(Contacts, $scope);
            }, function(reason) {
                NREUM.noticeError('Grid Load Failed for ' + Contacts.serviceName +  ' reason: ' + reason);
            });
        }
    ]);
});
