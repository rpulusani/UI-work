
angular.module('mps.filterSearch')
.controller('DeviceRequestTypeFilterController', ['$scope', '$translate', 'ServiceRequestTypes',
    function($scope, $translate, ServiceRequestTypes) {
        var option =  {
            'params': {
                category: 'MADC'
            }
        };

        ServiceRequestTypes.get(option).then(function (response) {
            if (ServiceRequestTypes.item && ServiceRequestTypes.item._embedded 
                && ServiceRequestTypes.item._embedded.requestTypes) {
                $scope.deviceRequestTypes = ServiceRequestTypes.item._embedded.requestTypes;
                groupBy();
            }
        });
        
        function groupBy(){
            var i=0,groupedTypes=[],tempType=[];
         	for(;i<$scope.deviceRequestTypes.length;i++){
         		if($scope.deviceRequestTypes[i] === 'INSTALL_BAU' || $scope.deviceRequestTypes[i] === 'MADC_INSTALL'){
         			tempType.push($scope.deviceRequestTypes[i]);
         		}else{
         			groupedTypes.push({value:$scope.deviceRequestTypes[i],disValue:$scope.deviceRequestTypes[i]});
         		}
         		
         	}
         	//combining the grouped 
         	groupedTypes.push({value:tempType.join(","),disValue:'MADC_INSTALL'});
         	$scope.deviceRequestTypes = groupedTypes; 
         }

        $scope.$watch('deviceRequestType', function(deviceRequestType) {
            if (deviceRequestType) {
                $scope.params['type'] = deviceRequestType;
                $scope.displayRequestType = deviceRequestType;
                if(deviceRequestType.indexOf("MADC_INSTALL") >= 0 && deviceRequestType.indexOf("INSTALL_BAU") >= 0) {
                    $scope.displayRequestType = "MADC_INSTALL";
                }
                $scope.filterDef($scope.params, ['status', 'from', 'to', 'bookmark', 'chlFilter', 'location', 'requesterFilter']);
            }
        });
    }
]);
