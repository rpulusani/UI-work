angular.module('mps.utility')
.factory('GridService', ['$q', '$timeout',  function($q, $timeout) {
    var columnDef = { columnDefs: [] };
        function addColumns(columnObject, returnFN){
            var columns = angular.copy(columnDef);
            var length = columnObject['defaultSet'].length;
            var workingColumns = columnObject['defaultSet'];
            if(columnObject.bookmarkColumn){
                columns.columnDefs.push({
                    name: '',
                    field: columnObject['bookmarkColumn'],
                    width:'30',
                    headerCellClass: 'no-border',
                    enableSorting: false,
                    cellTemplate: '<i class="icon icon--ui icon--not-favorite"></i>',
                    enableColumnMenu: false,
                    cellClass: 'bookmark'
                });
            }
            for(var i = 0; i < length; ++i){
                 var item = angular.copy(workingColumns[i]);
                 item.enableColumnMenu = false;
                 columns.columnDefs.push(item);
            }
            returnFN(angular.copy(columns));
        }

        return {
            getGridOptions: function (service, type){
                var options = {};
                var columns = service.getColumnDefinition(type);
                return $q(function(resolve, reject){
                    addColumns(columns,
                            function(columnArray){
                                options =  {
                                    //paginationPageSize: 5,
                                    enableRowSelection: true,
                                    enableSelectAll: true,
                                    showGridFooter:true,
                                    columnDefs: columnArray['columnDefs'],
                                    gridCss: 'table'
                                };
                        });
                    $timeout(function(){
                        if(options !== undefined && options['columnDefs'] !== undefined && options['columnDefs'].length > 0){
                            resolve(options);
                        }else{
                            reject("There were no columns");
                        }
                    }, 1000);
                });
            }
        };

}]);
