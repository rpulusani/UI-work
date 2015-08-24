'use strict';
angular.module('mps.serviceRequestContacts')
.controller('ContactsController', ['$scope', '$location', '$routeParams', 'History', 'ContactService',
    function($scope, $location, $routeParams, History, ContactService) {
        var init = function() {
            //TODO: Remove hardcoded accountId, which needs to come from login.
            $scope.contacts = ContactService.query({accountId: 1});
        };
        init();

        $scope.back = function() {
            History.back();
        };

        $scope.goToCreate = function() {
            $location.path('/service_requests/contacts/new');
        }

        $scope.goToUpdate = function(contact) {
            $location.path('/service_requests/contacts/' + contact.id + '/update');
        };

        $scope.remove = function(contact) {
            ContactService.delete(contact, function(){
                $scope.contacts.splice($scope.contacts.indexOf(contact), 1);
            }, function(response){
                console.log(response);
            });
        };
    }
]).controller('ContactController', ['$scope', '$location', '$routeParams', 'History', 'ContactService',
    function($scope, $location, $routeParams, History, ContactService) {
        var init = function() {
            $scope.reviewing = false;

            if($routeParams.id) {
                $scope.contact = ContactService.get({accountId: 1, id: $routeParams.id});
            } else {
                $scope.contact = {accountId: 1};
            }

        };
        init();

        $scope.review = function() {
            $scope.reviewing = true;
        }
        $scope.edit = function() {
            $scope.reviewing = false;
        }

        var redirect_to_list = function() {
            $location.path('/service_requests/contacts');
        };

        var error_saving = function(error) {
            console.log('Could not save contact because ' + JSON.stringify(error));
        };

        $scope.save = function() {
            if ($scope.contact.id) {
                ContactService.update($scope.contact, redirect_to_list, error_saving);
            } else {
                ContactService.save($scope.contact, redirect_to_list, error_saving);
            }

        };

        $scope.back = function() {
            History.back();
        };

        $scope.cancel = redirect_to_list;

    }
]);
