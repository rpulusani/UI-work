
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
        SecurityHelper) {

        if(Contacts.item === null){       
            $location.path('/service_requests/contacts/');
        }
        $scope.configure = {
     		  	   
        };
        SRHelper.addMethods(Contacts, $scope, $rootScope);
        $scope.setTransactionAccount('ContactUpdate', Contacts);
        new SecurityHelper($rootScope).redirectCheck($rootScope.contactAccess);
        $scope.configure = {
        		header : {
        				translate : {
        					body :'CONTACT_MAN.UPDATE_CONTACT.TXT_UPDATE_SUPPLES_CONTACT_REVIEW'
        				}
        		},	
        		button : {
        					name : 'CONTACT_MAN.UPDATE_CONTACT.BTN_UPDATE_SUPPLIES_CONTACT'  
        		} 
        };

        $scope.updating = true;

        $timeout (function() {
            $rootScope.contactAlertMessage = undefined;
        }, 8000);

        if(Contacts.item === null){
            $scope.redirectToList();
        }else{
            Contacts.tempSpace = {};
            $scope.contact = Contacts.item;
            $scope.address = {};
            $scope.address.buildingName = $scope.contact.address.physicalLocation1;  
            $scope.address.floorName = $scope.contact.address.physicalLocation2;
            $scope.address.siteName = $scope.contact.address.physicalLocation3;
            
            var tempAddress = {};
            angular.extend(tempAddress,Contacts.item.address);
            $scope.contact.address = {};
            
            $scope.contact.address.addressLine1 = tempAddress.addressLine1;
            $scope.contact.address.addressLine2 = tempAddress.addressLine2;
            $scope.contact.address.countryIsoCode = tempAddress.countryIsoCode;
            $scope.contact.address.city = tempAddress.city;
            $scope.contact.address.country = tempAddress.country;
            $scope.contact.address.state = tempAddress.state;
            $scope.contact.address.id = tempAddress.id;
            $scope.contact.address.postalCode = tempAddress.postalCode;
            
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

        $scope.isLoading = false;
        $scope.saveContact = function(contactForm) {
                updateContactObjectForSubmit();
                Contacts.item.postURL = Contacts.item._links.self.href;

                delete $scope.contact.account;
                delete $scope.contact.params;
                delete $scope.contact.url;
                delete $scope.contact.primaryContact;
                delete $scope.contact.requestedByContact;
                $scope.isLoading = true;
                var deferred = Contacts.put({
                    item: $scope.contact
                });

                deferred.then(function(result){
                    $rootScope.contactAlertMessage = 'updated';
                    window.scrollTo(0,0);
                    $rootScope.originalContact = angular.copy($scope.contact);
                    $scope.isLoading = false;
                    $location.path(Contacts.route + '/' + $scope.contact.id + '/update');
                }, function(reason){
                    NREUM.noticeError('Failed to update Contact because: ' + reason);
                });

        };

    }
]);
