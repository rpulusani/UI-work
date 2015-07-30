 angular.module('mps')
    .controller("AddressesController", ['$scope', '$location', function($scope, $location){

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
        console.log("cancel");
        $location.path("/");
        return false;
    };

    $scope.attachmentIsShown = false;

    $scope.attachmentToggle = function(){
        $scope.attachmentIsShown = !$scope.attachmentIsShown;
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
            zipCode: '40404'
        }
    ];
    return {
        get: function(id) { return addresses[id]; },
        query: function() { return addresses; }
    };
}]);
