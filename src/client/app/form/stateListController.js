angular.module('mps.form')
.controller('StateListController', 
		['$scope','$element','$attrs','CountryService',
        function($scope, $ele, $attrs, CountryService){
			
				
				 $scope.countryService = CountryService;
	             CountryService.setProvinceByCode($scope.stateCode);
	             
	             $scope.countryService = CountryService;
	         
	             $scope.stateLabel='ADDRESS_MAN.COMMON.TXT_STATE';
	             
	             var labelProvince=["argentina","canada","spain",
	             	             "portugal","france","netherlands"]	;
	             var labelState=["usa","india","australia","brazil",
	            	             "mexico"];
	             var labelCounty=["ireland"];
	             
	             
	             if ($scope.countryModel && $scope.countryModel !== ""){
	            	 setupState();
	             }
	             $scope.$on('countrySelected', function (event, args) {
	            	 setupState();	            	 
		         });
	             
	            function setupState(){
	            	
	            	var countryName=$scope.countryService.item.name.toLowerCase();
	            	 
		             if (labelCounty.indexOf(countryName)!=-1){
		             	$scope.stateLabel='ADDRESS.COUNTY';
		             }else if (labelProvince.indexOf(countryName)!=-1){
		             	$scope.stateLabel='ADDRESS.PROVINCE';
		             }
		             
		             if((labelProvince.concat(labelState)).indexOf(countryName)==-1){
		             	$scope.stateOrPostalMandatory = false;
		             	$scope.zipMandatory = true;
		             }else{
		             	$scope.stateOrPostalMandatory = true;
		             	$scope.zipMandatory = false;
		             }
	            } 	
	           
			
			
             $scope.provinceSelected = function(provinceCode) {
                 CountryService.setProvinceByCode(provinceCode);

                 $scope.stateCode = CountryService.stateCode;
             }
             
		}
         
]);

