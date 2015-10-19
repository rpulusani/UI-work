define(['angular', 'contact', 'utility.grid'], function(angular) {
    'use strict';
    angular.module('mps.serviceRequestContacts')
    .controller('ContactListController', ['$scope', '$location', 'grid', 'Contacts', '$rootScope',
        'PersonalizationServiceFactory',
        function($scope, $location, Grid, Contacts, $rootScope, Personalize) {
            $rootScope.currentRowList = [];
            var personal = new Personalize($location.url(), $rootScope.idpUser.id);
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
            $scope.gridOptions.onRegisterApi = Grid.getGridActions($rootScope, Contacts, personal);
            Contacts.getPage().then(function() {
                Grid.display(Contacts, $scope, personal);
            }, function(reason) {
                NREUM.noticeError('Grid Load Failed for ' + Contacts.serviceName +  ' reason: ' + reason);
            });
        }
    ]);
});
