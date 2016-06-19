

angular.module('mps.orders')
.controller('DeviceOrderHistoryController', [
    '$scope',
    '$location',
    '$rootScope',
    '$http',
    'OrderItems',
    'grid',
    'PersonalizationServiceFactory',
    'FilterSearchService',
    'ServiceRequestService',
    'SRControllerHelperService',
    '$timeout',
    function(
        $scope,
        $location,
        $rootScope,
        $http,
        OrderItems,
        GridService,
        Personalize,
        FilterSearchService,
        ServiceRequest,
        SRHelper,
        $timeout) {

        SRHelper.addMethods(ServiceRequest, $scope, $rootScope);        

        ServiceRequest.setItem($scope.configure.sr);
        
        ServiceRequest.item.get().then(function(){
            $scope.sr = ServiceRequest.item;
            
            if($scope.sr.item.orderItems && $scope.sr.item.orderItems !== null){
                addSupplyOrderInfo();
            }
        }); 

        function addSupplyOrderInfo(){
            $timeout(function(){
                OrderItems.columns = 'pruchaseSet';
                $scope.$broadcast('OrderContentRefresh', {
                    'OrderItems': $scope.sr.item.orderItems // send whatever you want
                });
            }, 2000);
        }        
    }
]);
