
angular.module('mps.filterSearch')
.controller('AllRequestTypeFilterController', ['$scope', '$translate', 'ServiceRequestTypes','$q',
    function($scope, $translate, ServiceRequestTypes,$q) {
        $scope.allRequestTypes=["BREAK_FIX"];
        var promises=[],defer;
        promises.push(ServiceRequestTypes.get({'params':{category: 'MADC'}}));
        promises.push(ServiceRequestTypes.get({'params':{category: 'DATA_MANAGEMENT'}}));
        $q.all(promises).then(function(response) {
        	angular.forEach(response,function(element){
        		if (element.data._embedded.requestTypes) {
            		$scope.allRequestTypes= $scope.allRequestTypes.concat(element.data._embedded.requestTypes);                   
                }        		
        	});
        	groupBy();
        	
        });
        function groupBy(){
        	var i=0,groupedTypes=[],tempType=[];
        	for(;i<$scope.allRequestTypes.length;i++){
        		if($scope.allRequestTypes[i] === 'INSTALL_BAU' || $scope.allRequestTypes[i] === 'MADC_INSTALL'){
        			tempType.push($scope.allRequestTypes[i]);
        		}else{
        			groupedTypes.push({value:$scope.allRequestTypes[i],disValue:$scope.allRequestTypes[i]});
        		}
        		
        	}
        	//combining the grouped 
        	groupedTypes.push({value:tempType.join(","),disValue:'MADC_INSTALL'});
        	$scope.allRequestTypes = groupedTypes; 
        }
        $scope.type="";
        $scope.$watch('type', function(type) {
        	    $scope.params['type'] = type;
                $scope.filterDef($scope.params, ['from', 'to', 'requesterFilter']);
        });
    }
]);
