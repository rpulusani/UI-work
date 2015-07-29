 angular.module('mps')
    .controller("AddressesController", ['$scope', '$location', 'Addresses', function($scope, $location, Addresses){

    $scope.continueForm = false;

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

    $scope.loadTestData = function(){
        $scope.contact.name = "Vickers PetsAtHome";
        $scope.contact.phoneNumber = "9992882222";
        $scope.contact.emailAddress = "vickerspets@test.com";
    };

    $scope.loadTestData();

    $scope.continue = function(){
        $scope.continueForm = true;
        return false;
    }

    $scope.save = function(){
        alert("saving: " + JSON.stringify([$scope.address, $scope.contact, $scope.serviceRequest]));
        return true;
    };

    $scope.back = function(){
        console.log("go back");
        if($scope.continueForm){
            $scope.continueForm = false;
        }else{
            $location.path("/");
        }

        return false;
    };

    $scope.cancel = function(){
        $location.path("/");
        return false;
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
        window.location = "/#/service_requests/addresses";
        return false;
    };

    $scope.requestDelete = function(){
        console.log("Requested deletion of " + $scope.currentAddress.addName);
        window.location = "/#/service_requests/addresses/delete/review";
        return false;
    };

    $scope.deleteAddress = function(id) {
        Addresses.currentAddress = $scope.getAddress(id);
        window.location = "/#/service_requests/addresses/delete";
    };

}])
.factory('Addresses', [
function() {
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
        get: function(id) {
            return addresses[id];
        },
        query: function() {
            return addresses;
        },
        currentAddress: {}
    };
}]);
