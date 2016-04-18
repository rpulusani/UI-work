
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
    'SecurityHelper',
    'Country',
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
        $timeout,
        SecurityHelper,
        Country) {

        SRHelper.addMethods(Contacts, $scope, $rootScope);
        $scope.setTransactionAccount('ContactUpdate', Contacts);
        new SecurityHelper($rootScope).redirectCheck($rootScope.contactAccess);


        $timeout (function() {
            $rootScope.contactAlertMessage = undefined;
        }, 8000);

        Country.get().then(function(){
           $scope.countries=Country.data;
        });
        $scope.countrySelected = function(countryId) {
               var item=$scope.countries.filter(function(item) {
                   return item.code === countryId; 
               });
               $scope.provinces = item[0].provinces;
       };

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
        };

        $scope.goToDelete = function(){
            ServiceRequest.reset();
            ServiceRequest.newMessage();
            $location.path(Contacts.route + '/delete/' + $scope.contact.id + '/review');
        };


        $scope.saveContact = function(contactForm) {
                updateContactObjectForSubmit();
                Contacts.item.postURL = Contacts.item._links.self.href;

                delete $scope.contact.account;
                delete $scope.contact.params;
                delete $scope.contact.url;
                delete $scope.contact.primaryContact;
                delete $scope.contact.requestedByContact;

                var deferred = Contacts.put({
                    item: $scope.contact
                });

                deferred.then(function(result){
                    $rootScope.contactAlertMessage = 'updated';
                    window.scrollTo(0,0);
                    $rootScope.originalContact = angular.copy($scope.contact);
                    $location.path(Contacts.route + '/' + $scope.contact.id + '/update');
                }, function(reason){
                    NREUM.noticeError('Failed to update Contact because: ' + reason);
                });

        };

    }
]);
