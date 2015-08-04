angular.module('mps')
.controller("AddressesController", ['$scope', '$location', 'Addresses',
    function($scope, $location, Addresses){

    //TODO: retrieve this from config
    var base_url = '';

    $scope.continueForm = false;
    $scope.submitForm = false;
    $scope.addresses = Addresses.query();

    $scope.contact = {
        name: '',
        phoneNumber: '',
        emailAddress: ''
    };

    $scope.address = {
        addName: '',
        storeName: '',
        addrLine1: '',
        addrLine2: '',
        city: '',
        country: '',
        state: '',
        zipCode: '',
        county: '',
        district:''
    };

    $scope.serviceRequest = {
        customerReferenceId: '',
        costCenter: '',
        addtnlDescription: '',
        requestedEffectiveDate: ''
    };

    //TODO: Remove loadTestData later
    $scope.loadTestData = function(){
        $scope.contact.name = "Vickers PetsAtHome";
        $scope.contact.phoneNumber = "9992882222";
        $scope.contact.emailAddress = "vickerspets@test.com";
    };

    $scope.loadTestData();

    $scope.save = function(){
        console.log("saving: " + JSON.stringify([$scope.address, $scope.contact, $scope.serviceRequest]));
        $scope.submitForm = true;
        Addresses.saveAddress($scope.address)
            .success(function(response, data) {
                console.log('success adding');
                //TODO: remove setting reference id later
                $scope.serviceRequest.customerReferenceId = '1-56781108741';
                $scope.addresses.push(data);
                $scope.add_success = true;
            })
            .error(function(response) {
                console.log('error adding');
                $scope.add_success = false;
            });
    };

    $scope.back = function(){
        if($scope.continueForm){
            $scope.continueForm = false;
        }else{
            $location.path("/");
        }
    };

    $scope.cancel = function(){
        $location.path("/");
    };

    $scope.continue = function() {
        $scope.continueForm = true;
    };

    $scope.attachmentIsShown = false;

    $scope.attachmentToggle = function(){
        $scope.attachmentIsShown = !$scope.attachmentIsShown;
    };

    $scope.addresses = Addresses.query();

    $scope.currentAddress = Addresses.currentAddress;

    $scope.getAddress = function(id){
        var addresses = $scope.addresses,
            length = addresses.length,
            address = {};
        for(var i = 0; i < length; ++i) {
            if(addresses[i].id === id) {
                address = addresses[i];
                break;
            }
        }
        return address;
    };

    $scope.cancelDelete = function(){
        Addresses.currentAddress = {};
        $location.path("/service_requests/addresses");
        return false;
    };

    $scope.requestDelete = function(){
        console.log("Requested deletion of " + $scope.currentAddress.addName);
        $location.path("/service_requests/addresses/delete/review");
        return false;
    };

    $scope.deleteAddress = function(id) {
        Addresses.currentAddress = $scope.getAddress(id);
        $location.path("/service_requests/addresses/delete");
    };

}])
.factory('Addresses', function($http) {
    var addresses = [
        {
            addName: 'Addy 1',
            storeName: 'Some Store',
            addrLine1: '123 Some Rd',
            addrLine2: null,
            city: 'Lexington',
            country: 'USA',
            state: 'KY',
            zipCode: '40404',
            id: "foo/1"
        },
        {
            addName: 'Addy 2',
            storeName: 'Another Store',
            addrLine1: '123 Some Other Rd',
            addrLine2: null,
            city: 'Lexington',
            country: 'USA',
            state: 'KY',
            zipCode: '40404',
            id: "foo/2"
        },
        {
            addName: 'Addy 3',
            storeName: 'Yet Another Store',
            addrLine1: '123 Long Cat Is Really Loooooooooooooong Rd',
            addrLine2: null,
            city: 'Lexington',
            country: 'USA',
            state: 'KY',
            zipCode: '40404',
            id: "foo/3"
        }
    ];
    return {
        get: function(id) { return addresses[id]; },
        query: function() { return addresses; },
        saveAddress: function(addressData) {
            return $http.get('/test');
            //TODO: this is the real one...
            // return $http.post(base_url,addressData);
        },
        currentAddress: {}
    };

    // var url = [base_url, '/addresses'].join('');
    // return $resource(url, {id: '@id'}, {});
});
