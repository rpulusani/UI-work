define(['angular', 'contact'], function(angular) {
    'use strict';
    angular.module('mps.serviceRequestContacts')
    .controller('ContactUpdateController', [
        '$scope',
        '$location',
        '$filter',
        '$routeParams',
        '$rootScope',
        'ServiceRequestService',
        'FormatterService',
        'BlankCheck',
        'Addresses',
        'Contacts',
        'SRControllerHelperService',
        'UserService',
        'HATEAOSConfig',
        '$timeout',
        function($scope,
            $location,
            $filter,
            $routeParams,
            $rootScope,
            ServiceRequest,
            FormatterService,
            BlankCheck,
            Addresses,
            Contacts,
            SRHelper,
            Users,
            HATEAOSConfig,
            $timeout) {

            SRHelper.addMethods(Contacts, $scope, $rootScope);

            $timeout (function() {
                $rootScope.contactAlertMessage = undefined;
            }, 3600);


            
            if(Contacts.item === null){
                $scope.redirectToList();
            }else{
                Contacts.tempSpace = {};
                $scope.contact = Contacts.item;
                if($rootScope.contactAlertMessage === 'saved'){
                    $rootScope.contactAlertMessage = 'saved';
                }else if($rootScope.contactAlertMessage === 'updated'){
                    $rootScope.contactAlertMessage = 'updated';
                }
            }

            var updateContactObjectForSubmit = function() {
                Contacts.item = $scope.contact;
                Contacts.addRelationship('account', Contacts.tempSpace.requestedByContact, 'account');
            };
           

            $scope.saveContact = function(contactForm) {
                    updateContactObjectForSubmit();
                    Contacts.item.postURL = Contacts.item._links.self.href;

                    delete $scope.contact.account;
                    delete $scope.contact.params;
                    delete $scope.contact.url;
                    
                    var deferred = Contacts.put({
                        item: $scope.contact
                    });

                    deferred.then(function(result){
                        $rootScope.contactAlertMessage = 'updated';
                        window.scrollTo(0,0);
                        //$location.path(Contacts.route + '/' + $scope.contact.id + '/update');
                    }, function(reason){
                        NREUM.noticeError('Failed to update Contact because: ' + reason);
                    });

            };

        }
    ]);
});
