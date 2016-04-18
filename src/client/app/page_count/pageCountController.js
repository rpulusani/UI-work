

angular.module('mps.pageCount')
.controller('PageCountController', [
    '$rootScope',
    '$scope',
    'SRControllerHelperService',
    'HATEOASFactory',
    function(
        $rootScope,
        $scope,
        SRHelper,
        HATEOASFactory
    ) {
    	var pageCount={
   			 route: '/page_count',
   			 item:{}
    	};
	   	var pageCountHateoas=new HATEOASFactory(pageCount);
	   	SRHelper.addMethods(pageCountHateoas, $scope, $rootScope);
	   	$scope.setTransactionAccount('PageCount', pageCountHateoas);
    }
]);

