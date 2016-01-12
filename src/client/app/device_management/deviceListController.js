define(['angular', 'deviceManagement', 'deviceManagement.deviceFactory', 'utility.grid'], function(angular) {
    'use strict';
    angular.module('mps.deviceManagement')
    .controller('DeviceListController', ['$scope', '$location', 'grid', 'Devices', '$rootScope',
        'PersonalizationServiceFactory', 'FilterSearchService',
        function($scope, $location, Grid, Devices, $rootScope, Personalize, FilterSearchService) {
            var secret = 'UeV5DfuEzXsLsTzRP1a3ragNAQRt73GrOK2XZkjm6zIXyNZD66LZt4LvUuVh3O8RUnoZhDPADxu6lXW030i9NSv_dfciMO3JDA-Dm5ePlvVUKW7RMXuVrJG8wjfOiiQQA7VoTXYiYPdTfawRvzaiqrwLD06dKXA4Mww2KLJppGA';
            var key = CryptoJS.SHA256(secret);
            console.log('key', key);
            var baseURL = 'https://in-qa.lexmark.com/SecureFileDelivery/SAP/';
            var url = baseURL + '005056B212C51ED5A6C1D0A361A33C77';
            var ts = new Date().toISOString();
            console.log('encodeURIComponent(ts)', encodeURIComponent(ts));

            url = url + '?ts='+encodeURIComponent(ts);
            var hash = CryptoJS.HmacSHA256(url, key);
            var hashInBase64 = CryptoJS.enc.Base64.stringify(hash);
            console.log('hashInBase64', hashInBase64);
            url = url + '&token=' + hashInBase64;
            console.log('url', url);
            //urlBuffer.append("&token=").append(Base64.encodeBase64URLSafeString(signature));
             
            //logger.debug("the encryptedURL="+urlBuffer.toString());

            $rootScope.currentRowList = [];
            $scope.visibleColumns = [];
            var personal = new Personalize($location.url(),$rootScope.idpUser.id),
            filterSearchService = new FilterSearchService(Devices, $scope, $rootScope, personal);

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
            filterSearchService.addBasicFilter('DEVICE_MGT.ALL_DEVICES', {'embed': 'address,contact'});
            //filterSearchService.addBasicFilter('DEVICE_MGT.BOOKMARKED_DEVICES');
            //filterSearchService.addPanelFilter('Filter By Location', 'locationFilter');
            filterSearchService.addPanelFilter('Filter By CHL', 'CHLFilter');
                $scope.$broadcast('setupColumnPicker', Grid);
        }
    ]);
});
