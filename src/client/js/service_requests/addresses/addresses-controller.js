 angular.module('mps')
    .controller("AddressesController", ['$scope', function($scope){

    $scope.contact = {
        name: '',
        phoneNumber: '',
        emailAddress: ''
    }

    $scope.address = {
        addName: '',
        storeName: '',
        addrLine1: '',
        addrLine2: '',
        city: '',
        country: '',
        state: '',
        zipCode: ''
    }

    $scope.serviceRequest = {
        customerReferenceId: '',
        costCenter: '',
        addtnlDescription: '',
        requestedEffectiveDate: ''
    }

    $scope.loadTestData = function(){
        $scope.contact.name = "Vickers PetsAtHome";
        $scope.contact.phoneNumber = "9992882222";
        $scope.contact.emailAddress = "vickerspets@test.com";
    }

    $scope.loadTestData();

    $scope.save = function(){
        alert("saving: " + JSON.stringify([$scope.address, $scope.contact, $scope.serviceRequest]));
    }
    $scope.back = function(){

    }

}]);