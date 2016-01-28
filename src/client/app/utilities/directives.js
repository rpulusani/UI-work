define(['angular', 'utility'], function(angular) {
    'use strict';
    angular.module('mps.utility')
    .directive('confirmCancel', ['$rootScope', function($rootScope){
        function link(scope, element, attrs) {
             element.on('$destroy', function() {
                if($rootScope.contactPickerReset){
                    $rootScope.returnPickerObject = undefined;
                    $rootScope.returnPickerSRObject = undefined;
                    $rootScope.selectedContact = undefined;
                    $rootScope.currentSelected = undefined;
                }
                if($rootScope.addressPickerReset){
                    $rootScope.returnPickerObjectAddress = undefined;
                    $rootScope.returnPickerSRObjectAddress = undefined;
                    $rootScope.selectedAddress = undefined;
                }
             });
        }
         return {
            restrict: 'A',
            scope: {
                title: '@',
                body: '@',
                cancel: '@',
                confirm: '@',
                returnPath: '@'
            },
            templateUrl: '/app/utilities/templates/confirm-cancel.html',
            controller: 'confirmCancelController',
            link:link
        };
    }])
    .directive('alertMessage', function() {
        return {
            restrict: 'A',
            templateUrl: '/app/utilities/templates/alerts.html',
        };
    })
    .directive('columnpicker', [function () {
        return {
            restrict: 'A',
            scope: {
                target: '=',
                columns: '@',
                grid: '@'
            },
            controller: 'ColumnPickerController'
        };
    }])
    .directive('printExportTitle', [function () {
        return {
            restrict: 'A',
            scope: {
                title: '@',
                print: '@'
            },
            template: '<div class="col-2-3" ng-cloak>' +
                '<h2 class="print-export-header" ng-show="itemtotal && title" translate="{{ title }}" translate-values="{total: itemtotal}"></h2>' +
                '<h2 class="print-export-header" ng-show="!itemtotal && title" translate="{{ title }}"></h2>' +
            '</div>' +
            '<div ng-if="displayPrint || displayExport" class="print-export" ng-cloak>' +
                '<span ng-if="displayPrint" class="">' +
                    '<i class="icon icon--mps icon--print"></i>' +
                    '<a translate="LABEL.PRINT" href="#" class="text--small text--semi-bold" ng-click="printGrid()"></a>' +
                '</span>' +

                '<span ng-if="displayExport" class="">' +
                    '<i class="icon icon--mps icon--download"></i>' +
                   '<a translate="LABEL.EXPORT" href="#" class="text--small text--semi-bold" ng-click="exportGrid()"></a>' +
                '</span>' +
            '</div>',
            controller: 'PrintExportTitleController'
        };
    }])
    .directive('pickContact', function(){
         return {
            restrict: 'A',
            scope: {
                currentContactTitle: '@',
                replaceContactTitle: '@'
            },
            templateUrl: '/app/utilities/templates/pick-contact.html',
            controller: 'ContactPickerController'
        };
    })
    .directive('pickAddress', function(){
         return {
            restrict: 'A',
            scope: {
                currentInstalledAddressTitle: '@',
                replaceAddressTitle: '@',
                sourceAddress: '@'
            },
            templateUrl: '/app/utilities/templates/pick-address.html',
            controller: 'AddressPickerController'
        };
    })
    .directive('pickDevice', function(){
         return {
            restrict: 'A',
            scope: {
                currentDeviceTitle: '@',
                replaceDeviceTitle: '@',
                singleDeviceSelection: '@',
                header:'@',
                bodyText:'@',
                readMore: '@',
                readMoreUrl:'@',
                abandonText: '@',
                submitText: '@'

            },
            templateUrl: '/app/utilities/templates/pick-device.html',
            controller: 'DevicePickerController'
        };
    })
    .directive('selectPageCount', function(){
         return {
            restrict: 'A',
            scope: {
                module: '=',
                readonly: '=',
                source: '@'
            },
            templateUrl: '/app/utilities/templates/select-page-count.html',
            controller: 'PageCountSelectController'
        };
    })
    .directive('fileUpload', function(){
         return {
            restrict: 'A',
            scope: {
                title: '@',
                body: '@',
                cancel: '@',
                confirm: '@',
                fileFormat: '@',
                fileList: '@'
            },
            templateUrl: '/app/utilities/templates/file-upload.html',
            controller: 'fileUploadController'
        };
    })
    .directive('pages', function(){
        return {
            restrict: 'A',
            templateUrl: '/app/utilities/templates/pages.html',
        };
    })
    .directive('pagination',['$timeout', function($timeout){
        var link = function(scope, element, attrs, controllers){
            $timeout(function(){
            if(scope.optionsName){
                scope.grid = scope[scope.optionsName];
            }else{
                scope.grid = scope['gridOptions'];
            }
            console.log(scope.grid);
            },0);
        };
        return {
            restrict: 'A',
            templateUrl: '/app/utilities/templates/pagination.html',
            link: link
        };
    }]);
});
