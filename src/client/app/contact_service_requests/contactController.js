define(['angular', 'contact'], function(angular) {
    'use strict';
    angular.module('mps.serviceRequestContacts')
    .controller('ContactController', ['$scope', '$location', 'Contacts', 'ServiceRequestService',
        function($scope, $location, Contacts, ServiceRequestService) {
            var redirect_to_list = function() {
               $location.path(Contacts.route + '/');
            };

            $scope.reviewing = false;

            $scope.review = function() {
                $scope.reviewing = true;
            };

            $scope.edit = function() {
                $scope.reviewing = false;
            };

            $scope.save = function() {
                if ($scope.contact._links) {
                    Contacts.update($scope.contact).then(function() {
                        redirect_to_list();
                    });
                } else {
                    Contacts.save($scope.contact).then(function() {
                        redirect_to_list();
                    });
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

            $scope.goToReview = function(contact) {
                $location.path(Contacts.route + '/' + contact.id + '/review');
            };

            $scope.cancel = function() {
                redirect_to_list();
            };

            if (Contacts.item === null) {
                redirect_to_list();
            } else {
                $scope.contact = Contacts.item;
            }
        }
    ]);
});
