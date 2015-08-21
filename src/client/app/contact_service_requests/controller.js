'use strict';
angular.module('mps.serviceRequestContacts')
.controller('ContactsController', ['$scope', '$location', '$routeParams', 'History', 'ContactService',
    function($scope, $location, $routeParams, History, ContactService) {

        //TODO: Remove hardcoded accountId, which needs to come from login.
        $scope.contacts = ContactService.query({accountId: 1});

        $scope.back = function() {
            History.back();
        };

        $scope.cancel = function() {
            $location.path('/service_requests/contacts');
        };

        $scope['continue'] = function() {
            $scope.continueForm = true;
        };

        $scope.goToCreate = function() {
            $scope.contact = {};
            $location.path('/service_requests/contacts/new');
        }

        $scope.goToRead = function(contact) {
            $location.path('/service_requests/contacts/' + contact.id + '/review');
        }

        $scope.goToViewAll = function() {
            $location.path('/service_requests/contacts');
        };

        $scope.goToUpdate = function(contact) {
            $location.path('/service_requests/contacts/' + contact.id + '/update');
        };

        $scope.removeContact = function(contact) {
            ContactService.delete({accountId: 1, contactId: contact.id}, function(){
                $scope.contacts.splice($scope.contacts.indexOf(contact), 1);
            }, function(response){
                console.log(response);
            });
        };
    }
]).controller('ContactController', ['$scope', '$location', '$routeParams', 'History', 'ContactService',
    function($scope, $location, $routeParams, History, ContactService) {
        var params = {accountId: 1, id: $routeParams.id};
        $scope.contact = ContactService.get(params);

        $scope.reviewing = false;
        $scope.review = function() {
            $scope.reviewing = true;
        }
        $scope.edit = function() {
            $scope.reviewing = false;
        }

        $scope.save = function() {
            ContactService.update(params, $scope.contact, function success(contact){
                $scope.submitForm = false;
                $location.path('/service_requests/contacts');
            }, function error(err) {
                console.log('something went wrong');
            });
        };

        $scope.back = function() {
            History.back();
        };

        $scope.cancel = function() {
            $location.path('/service_requests/contacts');
        };

    }
]);
