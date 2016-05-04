angular.module('mps.form')
.controller('StateListController', 
		['$scope','$element','$attrs','CountryService',
        function($scope, $ele, $attrs, CountryService){
			
				console.log('in controller');
				 $scope.countryService = CountryService;
	             CountryService.setProvinceByCode($scope.stateCode);
	             console.log('in country ser '+CountryService);
	             $scope.countryService = CountryService;
	         
	             $scope.stateLabel='ADDRESS_MAN.COMMON.TXT_STATE';
	             
	             var labelProvince=["argentina","canada","spain",
	             	             "portugal","france","netherlands"]	;
	             var labelState=["usa","india","australia","brazil",
	            	             "mexico"];
	             var labelCounty=["ireland"];
	             console.log('$scope.countryModel !== "" '+$scope.countryModel);
	             console.log('$scope.countryModel !== "" '+typeof $scope.countryModel);
	             if ($scope.countryModel && $scope.countryModel !== ""){
	            	 setupState();
	             }
	             $scope.$on('countrySelected', function (event, args) {
	            	 setupState();	            	 
		             //$scope.$apply();
		             //$scope.required = $scope.stateOrPostalMandatory;
	             });
	             
	            function setupState(){
	            	
	            	var countryName=$scope.countryService.item.name.toLowerCase();
	            	 console.log('in evele country selected'+countryName);
		             if (labelCounty.indexOf(countryName)!=-1){
		             	$scope.stateLabel='ADDRESS.COUNTY';
		             }else if (labelProvince.indexOf(countryName)!=-1){
		             	$scope.stateLabel='ADDRESS.PROVINCE';
		             }
		             console.log(" state =" + $scope.stateLabel);
		             if((labelProvince.concat(labelState)).indexOf(countryName)==-1){
		             	$scope.stateOrPostalMandatory = false;
		             	$scope.zipMandatory = true;
		             }else{
		             	$scope.stateOrPostalMandatory = true;
		             	$scope.zipMandatory = false;
		             }
	            } 	
	            // if ($scope.required === undefined) {
	                 
	            // }

			
			
             $scope.provinceSelected = function(provinceCode) {
                 CountryService.setProvinceByCode(provinceCode);

                 $scope.stateCode = CountryService.stateCode;
             }
            console.log(" out countroler") 
		}
         
]);

