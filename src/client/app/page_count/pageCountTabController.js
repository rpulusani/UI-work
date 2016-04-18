

angular.module('mps.pageCount')
.controller('PageCountTabController', [
    '$rootScope',
    '$scope',
    'SecurityHelper',
    '$location',
    function(
        $rootScope,
        $scope,
        SecurityHelper,
        $location
    ) {
    	
    	if (!$rootScope.pageCountAccess){
    		 $location.path('device_management');
    		 return;
    	}
       // new SecurityHelper($rootScope).redirectCheck($rootScope.orderAccess);
        $scope.active = function(value){
            $rootScope.serviceTabSelected = value;
        };

        $scope.isActive = function(value){
            var passed = false;
            if($rootScope.serviceTabSelected === value){
                passed = true;
            }
            return passed;
        };

        $scope.formatRomeDate = function(date) {
            console.log(date)
            if (date) {
                console.log(date.replace(/T.*/, ''));
                return date.replace(/T.*/, '');
            } else {
                return '';
            }
        }

        $scope.getTodaysDate = function() {
            var today = new Date(),
            day = today.getDate(),
            month = today.getMonth() + 1,
            year = today.getFullYear();
            
            if (day < 10){
                day = '0' + day
            } 

            if (month < 10){
                month = '0' + month
            }

            today = year + '-' + month + '-' + day;

            return today;
        }

        $scope.active('allPageCountTab');
    }
]);

