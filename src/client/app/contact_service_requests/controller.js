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
        };

        $scope.goToUpdate = function(contact) {
            var href = contact._links.self.href;
            var contact_id = href.split('/').pop();
            $location.path('/service_requests/contacts/' + contact_id + '/update');
        };

        $scope.remove = function(contact) {
            ContactService.delete(contact, function(){
                $scope.contacts.splice($scope.contacts.indexOf(contact), 1);
            });
        };
    }
]).controller('ContactController', ['$scope', '$location', '$routeParams', 'History', 'ContactService',
    function($scope, $location, $routeParams, History, ContactService) {
        $scope.reviewing = false;
        //TODO: Remove hardcoded accountId, which needs to come from login.
        var acct_id = 1;
        if($routeParams.id) {
            $scope.contact = ContactService.get({accountId: acct_id, id: $routeParams.id});
        } else {
            $scope.contact = {accountId: acct_id};
        }

        $scope.review = function() {
            $scope.reviewing = true;
        };
        $scope.edit = function() {
            $scope.reviewing = false;
        };

        $scope.save = function() {
            if ($scope.contact.id) {
                ContactService.update($scope.contact, redirect_to_list);
            } else {
                ContactService.save($scope.contact, redirect_to_list);
            }

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
