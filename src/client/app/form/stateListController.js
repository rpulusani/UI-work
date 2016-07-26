angular.module('mps.form')
.controller('StateListController', 
		['$scope','$element','$attrs','CountryService',
        function($scope, $ele, $attrs, CountryService){
			
				
				 $scope.countryService = CountryService;
	             CountryService.setProvinceByCode($scope.stateCode);
	             
	             $scope.countryService = CountryService;
	         
	             $scope.stateLabel='ADDRESS_MAN.COMMON.TXT_STATE';
	             
	             var labelProvince = ["argentina","canada","spain",
	             	             "portugal","france","netherlands", "brazil"];
	             var labelState = ["usa","india","australia","brazil",
	            	             "mexico"];
	             var labelCounty = ["ireland"];
	             
	             var zipMandatoryList = ["zimbabwe","united arab emirates","antigua & barbuda","angola","aruba",
	                                 "burkina faso","burundi","benin", "bahamas", "botswana","congo  democratic republic",
	                                 "central african republic", "congo", "cote divoire","cook islands","cameroon",
	                                 "curacao", "djibouti","dominica","eritrea","fiji","grenada","ghana","gambia",
	                                 "guinea","equatorial guinea","guyana","ireland","kenya","kiribati","comoros",
	                                 "st kitts & nevis","north korea","kuwait","st ucia","mali","macau","mauritania",
	                                 "montserrat","mauritius","malawi","nauru","niue","qatar","solomon islands",
	                                 "seychelles","sierra leone","somalia","suriname","sao tome & principe",
	                                 "sint maarten","syrian arab republic","french southern territory",
	                                 "togo","tokelau","timor-leste","tonga","tuvalu","tanzania",
	                                 "uganda","vanuatu","yemen"];
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
		             	$scope.stateOrPostalMandatory = false;
		             	$scope.zipMandatory = false;
		             	
		             if (zipMandatoryList.indexOf(countryName) != -1){
		            	 
		             	$scope.stateOrPostalMandatory = false;
		             	$scope.zipMandatory = true;
		             	
		             }else if ((labelProvince.concat(labelState)).indexOf(countryName) != -1){
		            	 
		             	$scope.stateOrPostalMandatory = true;
		             	$scope.zipMandatory = false;
		             	
		             }
	            } 	
	           
			
			
             $scope.provinceSelected = function(provinceCode) {
                 CountryService.setProvinceByCode(provinceCode);

                 $scope.stateCode = CountryService.stateCode;
             }
             if($scope.provinceName){
             	for(var x =0;x<$scope.countryService.item.provinces.length;x++){
             		if($scope.countryService.item.provinces[x].name === $scope.provinceName){
             			$scope.stateCode = $scope.countryService.item.provinces[x].code;
             			break;
             		}
             	}
             }
		}
         
]);

