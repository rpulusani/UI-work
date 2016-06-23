
angular.module('mps.filterSearch')
.controller('GridSearchController', ['$scope', '$routeParams', '$route', '$location','$window', '$rootScope',
    function($scope, $routeParams, $route, $location,$window, $rootScope) {
        var paramsList = ['search', 'searchOn'],
        searchParams = $location.search();
        $scope.column = searchParams.searchOn;
	    
        $scope.showSearchMessage = false;
        $scope.searchBy = undefined;
        $scope.searchByDisplayName = undefined;
        $scope.searchByValue = searchParams.search;
        $scope.totalItems = 0;

        $scope.$on('columnPickerSelect', function(e, col) {
            var newSet = angular.copy($scope.columnSet);
            
            if(col.notSearchable === undefined || !col.notSearchable){
            	newSet.push(col);
            }
            	

            $scope.columnSet = newSet;
            $scope.$apply();
           
            $rootScope.$broadcast('setUpSearchCss');
        });

        $scope.$on('columnPickerDeselect', function(e, col) {
            var i = 0,
            newSet = angular.copy($scope.columnSet);

            for (i; i <  newSet.length; i += 1) {
                if (newSet[i].name === col.name) {
                    newSet.splice(i, 1);
                }
            }

            $scope.columnSet = newSet;
            $scope.$apply();
            
            $rootScope.$broadcast('setUpSearchCss');
        });

        if (!$scope.searchByValue) {
            $scope.searchByValue = '';
        }

        $scope.$watch('total', function(total) {
        	 if (total) {
                $scope.totalItems = total.totalItems();
            }
        });

        $scope.columns.then(function(data) {
            var i = 0,
            setArr = [];

            for (i; i < data.length; i += 1) {
                if (data[i].visible !== false) {
                    setArr.push(data[i]);
                }
            }

            $scope.columnSet = setArr;
        });

        $scope.gridSearch = function(){
            if($scope.searchBy === undefined && $scope.columnSet && $scope.columnSet.length > 0){
                $scope.searchByColumn($scope.columnSet[0]);
            }
            searchParams = $location.search();

            if (searchParams.searchOn && searchParams.search) {
                $scope.searchByValue = searchParams.search;
                $scope.searchBy = searchParams.searchOn;
            }

            if($scope.searchBy && typeof $scope.search === 'function' && $scope.searchByValue){
            	$scope.params['search'] = encodeURIComponent($scope.searchByValue);
                $scope.params['searchOn'] = $scope.searchBy.replace('_embedded.','');
                $scope.showSearchMessage = true;

                $scope.showGridSearch();
                $scope.search($scope.params, paramsList);
            }else{
                $scope.clearSearch();
            }
        };

        $scope.searchByColumn = function(selectedOption) {
            $scope.searchByDisplayName  = selectedOption.name;
            $scope.searchBy = selectedOption.searchOn;
        };

        $scope.clearSearch = function(){
            $scope.showSearchMessage = false;
            $scope.searchByValue = '';
            $scope.params = {};
            $scope.preventSearch();
            $scope.search($scope.params, paramsList);
        };
        
        if($rootScope.mandatSearchGridContent !== undefined && $rootScope.mandatSearchGridContent !== null) {
            $scope.mandatSearchGridContent = $rootScope.mandatSearchGridContent;
            $rootScope.mandatSearchGridContent = null;
        }
        
        $scope.preventSearch = function(){
            if($scope.mandatSearchGridContent !== undefined && $scope.mandatSearchGridContent !== null) {
                $scope.mandatSearchGridContent.hide();
                return;
            }
        };

        $scope.showGridSearch = function(){
            if($scope.mandatSearchGridContent !== undefined && $scope.mandatSearchGridContent !== null) {
                $scope.mandatSearchGridContent.show();
            }
        };
    }
]);
