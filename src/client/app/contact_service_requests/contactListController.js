define(['angular', 'contact', 'utility.grid'], function(angular) {
    'use strict';
    angular.module('mps.serviceRequestContacts')
    .controller('ContactListController', ['$scope', '$location', 'grid', 'Contacts', '$rootScope',
        'PersonalizationServiceFactory',
        function($scope, $location, Grid, Contacts, $rootScope, Personalize) {
            var personal = new Personalize($location.url(), $rootScope.idpUser.id);

            $rootScope.currentRowList = [];

            $scope.goToCreate = function() {
                Contacts.item = {};
                $location.path(Contacts.route + '/new');
            };

            $scope.goToUpdate = function(contact) {
                Contacts.item = contact;
                $location.path(Contacts.route + '/' + Contacts.item.id + '/update');
            };

            $scope.gridOptions = {};

            Contacts.columns = 'fullSet';

            $scope.gridOptions.onRegisterApi = Grid.getGridActions($rootScope, Contacts, personal);
          
            Contacts.get().then(function() {
                Grid.display(Contacts, $scope, personal);
            }, function(reason) {
                NREUM.noticeError('Grid Load Failed for ' + Contacts.serviceName +  ' reason: ' + reason);
            });
        }
    ]);
});
