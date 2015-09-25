define(['angular', 'contact', 'utility.gridService'], function(angular) {
    'use strict';
    angular.module('mps.serviceRequestContacts')
    .controller('ContactListController', ['$scope', '$location', 'gridService', 'Contacts', '$rootScope',
        function($scope,  $location,  GridService, Contacts, $rootScope) {
            $rootScope.currentAccount = '1-74XV2R';

            $scope.goToCreate = function() {
                $location.path('/service_requests/contacts/new');
            };

            $scope.goToUpdate = function(contact) {
                var href = contact._links.self.href,
                contact_id = href.split('/').pop();
                
                $location.path('/service_requests/contacts/' + contact_id + '/update');
            };

            $scope.gridOptions = {};
            
            GridService.getGridOptions(Contacts, '').then(
                function(options){
                    $scope.gridOptions = options;
                    $scope.pagination = GridService.pagination(Contacts, $rootScope);
                    Contacts.resource($rootScope.currentAccount, 0).then(
                        function(response){
                            $scope.gridOptions.data = Contacts.addFunctions(Contacts.getList());
                        }
                    );
                },
                function(reason){
                     NREUM.noticeError('Grid Load Failed: ' + reason);
                }
            );
        }
    ]);
});
