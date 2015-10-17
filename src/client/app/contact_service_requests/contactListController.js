define(['angular', 'contact', 'utility.grid'], function(angular) {
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

            $scope.gridOptions = {};

            Contacts.getPage().then(function() {
                Grid.display(Contacts, $scope);
            }, function(reason) {
                NREUM.noticeError('Grid Load Failed for ' + Contacts.serviceName +  ' reason: ' + reason);
            });
        }
    ]);
});
