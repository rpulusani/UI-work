

angular.module('mps.report')
.controller('ReportListController', ['$scope', '$location', 'grid', 'Reports', '$rootScope',
        'PersonalizationServiceFactory', '$filter', '$translate',
        function($scope, $location, GridService, Reports, $rootScope, Personalize, $filter, $translate) {
        var personal = new Personalize($location.url(), $rootScope.idpUser.id);
        var params = {};
	
        $scope.configure = {};
        if (Reports.item === null) {
            $location.path(Reports.route);
        } else {
            $scope.report = Reports.item;

            if (Reports.item.id === 'mp9058sp') {
                $scope.print = false;
            }
            if (Reports.item.id === 'mp9073') {
                $scope.print = false;
            }
            if (Reports.item.id === 'mp0075') {
                $scope.print = false;
            }
            if (Reports.item.id === 'mp0021') {
                $scope.print = false;
            }
            if (Reports.item.id === 'hw0008') {
                $scope.print = false;
            }
            if (Reports.item.id === 'pb0001') {
                $scope.print = false;
            }
            if (Reports.item.id === 'hw0015') {
                $scope.print = false;
            }
            if (Reports.item.id === 'sd0101') {
                $scope.print = false;
            }          
            

            configureTemplates();
            configureFinderType();

            // Setting up the grid
            var Grid = new GridService();
            $scope.gridOptions = {};            
            $scope.gridOptions.onRegisterApi = Grid.getGridActions($rootScope, Reports.item.results, personal);

            $scope.gridDataCnt = 0;            

            $scope.breadcrumbs = {
                1: {
                    href: '/reporting',
                    value: 'REPORTING.TITLE'
                },
                2: {
                    value: $scope.report.name
                }
            };

            if($scope.report.id === "mp9058sp" || ($scope.report.id !== "mp9058sp" 
                && Reports.isRun === true)) {
                $scope.isLoading=true;
                $scope.gridOptions.showLoader = true;
                $scope.gridLoading = true;
                Reports.isRun = false;
                        
                Reports.item.links.results({
                    serviceName: 'results',
                    embeddedName: 'reportData',
                    columns: Reports.item.id,
                    columnDefs: Reports.columnDefs,
                    params: params
                }).then(function(res) {
                    $scope.gridLoading = false;
                    $scope.isLoading=false;
                    $scope.configure.button = {
                            name : $translate.instant('REPORTING.RUN_REPORT')     
                    };
                    Reports.item.results.hideBookmark = true;
                    if(res._embedded && res._embedded.reportData){
                        $scope.gridDataCnt = Reports.item.results.data.length;   
                              
                        Grid.display(Reports.item.results, $scope, personal, false, function() {
                                $scope.gridTitle = $translate.instant($scope.report.name + ' ({{ total }})', {total: Math.max(0, $scope.pagination.totalItems())});                            
                            $scope.$broadcast('setupPrintAndExport', $scope);
                        });
                    }
                    else
                    {
                        Grid.display(Reports.item.results, $scope, personal, false, function() {
                                $scope.gridTitle = $translate.instant($scope.report.name + ' ({{ total }})', {total: Math.max(0, $scope.gridDataCnt)});                            
                            $scope.$broadcast('setupPrintAndExport', $scope);
                        });
                    }
                }, function(reason) {
                    Reports.isRun = false;
                    NREUM.noticeError('Grid Load Failed for ' + Reports.serviceName +  ' reason: ' + reason);
                });
            }
        }

        function configureTemplates() {
            $scope.configure = {
                header: {
                    translate: {
                        h1: 'REPORTING.RUN_TITLE',
                        h1Values: {'report': $scope.report.name },
                        body: 'MESSAGE.LIPSUM',
                    }
                },
				button : {
                       name : 'REPORTING.RUN_REPORT'  
                   }
            };
        }

        function configureFinderType() {
            switch ($scope.report.id) {
                /* Asset Register */
                case 'mp9058sp':
                    /* NO FILTER */
                    break;
                /* MADC */
                case 'mp9073':
                    params = {
                        eventType: Reports.finder ? (Reports.finder.selectType !== 'All' ? Reports.finder.selectType : '') : '',
                        eventDateFrom: Reports.finder ? $filter('date')(Reports.finder.dateFrom, 'yyyy-MM-dd') : '',
                        eventDateTo: Reports.finder ? $filter('date')(Reports.finder.dateTo, 'yyyy-MM-dd') : ''
                    };
                    break;
                /* Missing Meter Reads */
                case 'mp0075':
                    params = {
                        meterSource: Reports.finder ? (Reports.finder.selectType !== 'All' ? Reports.finder.selectType : '') : '',
                        numberOfDays: Reports.finder ? Reports.finder.mmrDays : ''
                    };
                    break;
                /* Consumables Orders */
                case 'mp0021':
                    params = {
                        orderType: Reports.finder ? (Reports.finder.selectType !== 'All' ? Reports.finder.selectType : '') : '',
                        srDateFrom: Reports.finder ? $filter('date')(Reports.finder.dateFrom, 'yyyy-MM-dd') : '',
                        srDateTo: Reports.finder ? $filter('date')(Reports.finder.dateTo, 'yyyy-MM-dd') : ''
                    };
                    break;
                /* Hardware Orders */
                case 'hw0008':
                    params = {
                        srDateFrom: Reports.finder ? $filter('date')(Reports.finder.dateFrom, 'yyyy-MM-dd') : '',
                        srDateTo: Reports.finder ? $filter('date')(Reports.finder.dateTo, 'yyyy-MM-dd') : ''
                    };
                    break;
                /* Pages Billed */
                case 'pb0001':
                    params = {
                        dateFrom: Reports.finder ? $filter('date')(Reports.finder.dateFrom, 'yyyy-MM-dd') : '',
                        dateTo: Reports.finder ? $filter('date')(Reports.finder.dateTo, 'yyyy-MM-dd') : ''
                    };
                    break;
                /* Hardware Installation Requests */
                case 'hw0015':
                    params = {
                        dateFrom: Reports.finder ? $filter('date')(Reports.finder.dateFrom, 'yyyy-MM-dd') : '',
                        dateTo: Reports.finder ? $filter('date')(Reports.finder.dateTo, 'yyyy-MM-dd') : '',
                    };
                    break;
                /* Service Detail Report */
                case 'sd0101':
                    params = {
                        srStatus: Reports.finder ? Reports.finder.srStatus : '',
                        dateFrom: Reports.finder ? $filter('date')(Reports.finder.dateFrom, 'yyyy-MM-dd') : '',
                        dateTo: Reports.finder ? $filter('date')(Reports.finder.dateTo, 'yyyy-MM-dd') : '',
                        withParts: Reports.finder ? Reports.finder.withParts : '',
                    };
                    break;
                default:
                    params = null;
            }
        }
    }
]);

