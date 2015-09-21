define(['angular', 'deviceManagement', 'deviceManagement.pageCountFactory'], function(angular) {
    'use strict';
    angular.module('mps.deviceManagement')
    .controller('DevicePageCountsController', ['$scope', '$location', '$routeParams', 'PageCount',
        function($scope, $location, $routeParams, PageCount) {
            var acctId = 1;
            $scope.showLess = true;
            $scope.file_list = ['.xls', '.xlsx', '.csv'].join(',');
            $scope.page_count_list = PageCount.pageCountTypes.query();
            $scope.currentDate = new Date(); 

            $scope.toggleDisplay = function(){
                $scope.showLess = !$scope.showLess;
            }

            if($routeParams.id) {
                $scope.selectedPageCount = PageCount.pageCounts.get({accountId: acctId, id: $routeParams.id});
            }

            $scope.filterByIds = function(pageCountType) {
                var selectedIds = ['lifetime-1','color-1','mono-1'];
                return (selectedIds.indexOf(pageCountType.id) !== -1);
            };

            $scope.selectPageCount = function(id, pageCountArr) {
                var i=0;
                for (i ; i < pageCountArr.length ; i++){
                    if(id === pageCountArr[i].id){
                        return pageCountArr[i];
                    }
                }
            };
        }
    ]);
});
