define(['angular', 'contact', 'utility.gridService', 'utility.historyUtility'], function(angular) {
    'use strict';
    angular.module('mps.serviceRequestContacts')
    .controller('ContactController', ['$scope', '$location', '$routeParams', '$rootScope', 'History',
                                      'Contacts', 'ServiceRequestService',
        function($scope, $location, $routeParams, $rootScope, History, Contacts, ServiceRequestService) {
            var redirect_to_list = function() {
                $location.path('/service_requests/contacts');
            };
            
            $scope.reviewing = false;

            if ($routeParams.id) {
                $scope.contact = ContactService.get({accountId: $rootScope.currentAccount, id: $routeParams.id});
            } else {
                $scope.contact = {accountId: $rootScope.currentAccount};
            }

            $scope.review = function() {
                $scope.reviewing = true;
            };

            $scope.edit = function() {
                $scope.reviewing = false;
            };

            $scope.save = function() {
                if ($scope.contact._links) {
                    $scope.contact.id = $scope.contact._links.self.href.split('/').pop();
                    $scope.contact.accountId = $scope.contact._links.account.href.split('/').pop();

                    Contacts.update($scope.contact, redirect_to_list);
                } else {
                    Contacts.save($scope.contact, redirect_to_list);
                }
            };

            $scope.service = {};

            $scope.saveServiceRequest = function(type) {
                $scope.service.type = type;
                $scope.service._link = $scope.contact._links;
                // TODO: following attributes should come from contact
                $scope.service.customerReferenceId = 'cust1234';
                $scope.service.costCenter = 'Boston';
                $scope.service.description = 'blah blah blah';
                $scope.service.assetCostCenter = 'Lexington';
                $scope.service.chlLevel = 'tbd';
                
                ServiceRequestService.save($scope.service, redirect_to_list);
            };

            $scope.back = function() {
                History.back();
            };

            $scope.cancel = function() {
                redirect_to_list();
            };
        }
    ])
});
