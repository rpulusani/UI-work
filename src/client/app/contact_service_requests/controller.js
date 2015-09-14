'use strict';
angular.module('mps.serviceRequestContacts')
.controller('ContactsController', ['$scope', '$location', '$routeParams', 'History', 'ContactService',
    function($scope, $location, $routeParams, History, ContactService) {
        //TODO: Remove hardcoded accountId, which needs to come from login.
        $scope.contactHAL = ContactService.getHAL({accountId: 1}, function(){
            $scope.contacts = $scope.contactHAL.contacts;
        });

        $scope.back = function() {
            History.back();
        };

        $scope.goToCreate = function() {
            $location.path('/service_requests/contacts/new');
        }

        $scope.goToUpdate = function(contact) {
            var href = contact._links.self.href;
            var contact_id = href.split('/').pop();
            $location.path('/service_requests/contacts/' + contact_id + '/update');
        };

        $scope.goToReview = function(contact) {
            var href = contact._links.self.href;
            var contact_id = href.split('/').pop();
            $location.path('/service_requests/contacts/' + contact_id + '/review');
        };

        // $scope.remove = function(contact) {
        //     ContactService.delete(contact, function(){
        //         $scope.contacts.splice($scope.contacts.indexOf(contact), 1);
        //     });
        // };
    }
]).controller('ContactController', ['$scope', '$location', '$routeParams', '$rootScope', 'History',
                                    'ContactService', 'ServiceRequestService',
    function($scope, $location, $routeParams, $rootScope, History, ContactService, ServiceRequestService) {
        $scope.reviewing = false;
        if($routeParams.id) {
            $scope.contact = ContactService.get({accountId: $rootScope.currentAccount, id: $routeParams.id});
        } else {
            $scope.contact = {accountId: $rootScope.currentAccount};
        }

        $scope.review = function() {
            $scope.reviewing = true;
        }
        $scope.edit = function() {
            $scope.reviewing = false;
        }

        $scope.save = function() {
            if ($scope.contact._links) {
                $scope.contact.id = $scope.contact._links.self.href.split('/').pop();
                $scope.contact.accountId = $scope.contact._links.account.href.split('/').pop();
                ContactService.update($scope.contact, redirect_to_list);
            } else {
                ContactService.save($scope.contact, redirect_to_list);
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

        $scope.cancel = function(){
            redirect_to_list();
        };

        var redirect_to_list = function() {
            $location.path('/service_requests/contacts');
        };

    }
]);
