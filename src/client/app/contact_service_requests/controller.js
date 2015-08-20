'use strict';
angular.module('mps.serviceRequestContacts')
.controller('ContactsController', ['$scope', '$http', '$location', '$routeParams', 'History', 'Contacts',
    function($scope, $http, $location, $routeParams, History, Contacts) {
        $scope.continueForm = false;
        $scope.submitForm = false;
        $scope.contacts = Contacts.contacts;
        $scope.contact = Contacts.contact;
   
        $scope.save = function(routeToTop) {
            var newContact = JSON.stringify($scope.contact),
            fd;

            $scope.submitForm = false; // Request data from the server
          
            if (!Contacts.contact) {
                fd = new FormData(document.getElementsByName('newContact')[0]);

                Contacts.save(fd, function(contact) {
                    Contacts.contacts = [];
                    $scope.contact = Contacts.contact;

                    $location.path('/service_requests/contacts/' + $scope.contact.id + '/review');
                });
            } else {
                fd = new FormData(document.getElementsByName('editContact')[0]);

                Contacts.update(fd, Contacts.contact.id, function(res) {
                    Contacts.contacts = [];
                    $location.path('/service_requests/contacts/' + $scope.contact.id + '/review');
                });
            }
        };

        $scope.back = function() {
            if ($scope.continueForm) {
                $scope.continueForm = false;
            }

            History.back();
        };

        $scope.cancel = function() {
            $location.path('/service_requests/contacts');
        };

        $scope['continue'] = function() {
            $scope.continueForm = true;
        };

        $scope.goToCreate = function() {
            Contacts.contact = null;
            $location.path('/service_requests/contacts/new');
        }

        $scope.goToRead = function(id) {
            $location.path('/service_requests/contacts/' + id + '/review');
        }

        $scope.goToViewAll = function(id) {
            $location.path('/service_requests/contacts');
        };

        $scope.goToUpdate = function(id) {
            $location.path('/service_requests/contacts/' + id + '/update');
        };

        $scope.removeContact = function(id) {
            Contacts.removeById(id, function() {
                if (Contacts.contacts.length === 0) {
                    $scope.contacts = []; // for use with ng-bind, hides table completely
                }
            });
        };

        if (Contacts.contacts.length === 0) {
            Contacts.query(function() {
                $scope.contacts = Contacts.contacts;
            });
        }

        if ($routeParams.id) {
            Contacts.getById($routeParams.id, function() {
                $scope.contact = Contacts.contact;
            });
        }
    }
]);
