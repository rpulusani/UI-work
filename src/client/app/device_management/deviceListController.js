define(['angular', 'deviceManagement', 'deviceManagement.deviceFactory'], function(angular) {
    'use strict';
    angular.module('mps.deviceManagement')
    .controller('DeviceListController', ['$scope', '$location', 'grid', 'Devices', '$rootScope',
        'PersonalizationServiceFactory',
        function($scope, $location, Grid, Devices, $rootScope, Personalize) {
            $rootScope.currentRowList = [];
            $scope.visibleColumns = [];
            var personal = new Personalize($location.url(),$rootScope.idpUser.id);

            $scope.goToCreate = function() {
                Devices.item = {};
                $location.path('/service_requests/devices/new');
            };

            $scope.view = function(device){
                Devices.setItem(device);
                var options = {
                    params:{
                        embed:'contact,address'
                    }
                };

                Devices.item.get(options).then(function(){
                    $location.path(Devices.route + '/' + device.id + '/review');
                });
            };


            $scope.visibleColumns =  Grid.getVisibleColumns(Devices); //sets initial columns visibility

            function display() {
                Grid.display(Devices, $scope, personal);
            }
            function failure(reason) {
                NREUM.noticeError('Grid Load Failed for ' + Devices.serviceName +  ' reason: ' + reason);
            }

            $scope.gridOptions = {};
            $scope.gridOptions.onRegisterApi = Grid.getGridActions($rootScope, Devices, personal);

            $scope.optionParams = {

            };

            $scope.searchFunctionDef  = function(params){
                var options  = {
                                'params':{
                                  'type': 'bookmarked'
                                }
                            };
                angular.extend(options.params, params);
                Devices.getPage(0, 20, options).then(display, failure);
                Devices.getPage(0, 20, options).then(display, failure);
            };

            $scope.filterOptions =
                [   {
                        display:'DEVICE_MGT.ALL_DEVICES',
                        functionDef: function(params){
                            var options  = {
                                'params':{
                                  'type': 'all_devices'
                                }
                            };
                            Devices.getPage(0, 20, options).then(display, failure);
                            $scope.optionParams  = params;
                        },
                        params: $scope.optionParams
                    },
                    {
                        display: 'DEVICE_MGT.BOOKMARKED_DEVICES',
                        functionDef: function(params){
                            var options  = {
                                'params':{
                                  'type': 'bookmarked'
                                }
                            };
                            Devices.getPage(0, 20, options).then(display, failure);
                            $scope.optionParams  = params;
                        },
                        params: $scope.optionParams
                    },
                    {
                        display: 'Filter By Location',
                        optionsPanel: 'locationFilter',
                        functionDef: function(params){
                            var options  = {
                                'params':{
                                  'type': 'locationFilter'
                                }
                            };
                            angular.extend(options.params, params);
                            Devices.getPage(0, 20, options).then(display, failure);
                            $scope.optionParams  = params;
                        },
                        params: $scope.optionParams
                    },
                    {
                        display: 'Filter By CHL',
                        optionsPanel: 'CHLFilter',
                        functionDef: function(params){
                            var options  = {
                                'params':{
                                  'type': 'locationFilter'
                                }
                            };
                            angular.extend(options.params, params);
                            Devices.getPage(0, 20, options).then(display, failure);
                            $scope.optionParams  = params;
                        },
                        params: $scope.optionParams
                    }
                ];
        }
    ]);
});
