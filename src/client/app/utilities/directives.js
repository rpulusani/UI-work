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
.directive('hrefTarget', function () {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
          var href = element.href;
          if(scope && scope.configure && scope.configure.header && scope.configure.header.readMoreUrlTarget) {
            element.attr("target", "_blank");
          }
        }
    };
})
.directive('statusBar', function() {
    return {
        restrict: 'A',
        templateUrl: '/app/utilities/templates/status-bar.html',
    };
})
.directive('statusDetails', function() {
    return {
        restrict: 'A',
        templateUrl: '/app/utilities/templates/status-details.html',
    };
})
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
.directive('breadcrumbs', [function () {
    return {
        restrict: 'A',
        scope: {
            map: '=map'
        },
        controller: 'BreadcrumbsController'
    };
}])
.directive('printExportTitle', [function () {
    return {
        restrict: 'A',
        scope: {
            titlestring: '@',
            titleValues: '@',
            print: '=?',
            export: '=?',
            nativePrint: '@',
            // csv model must be defined to create a csv
            csvExport: '=?',
            pdfExport: '=?'
        },
        template: '<div class="col-3-4" ng-cloak>' +
            '<h2 class="print-export-header vertical-margin-bottom-0" ng-show="titleValues && titlestring" translate="{{ titlestring }}" translate-values="{{titleValues}}"></h2>' +
            '<h2 class="print-export-header vertical-margin-bottom-0" ng-show="!titleValues && titlestring" translate="{{ titlestring }}"></h2>' +
        '</div>' +
        '<div ng-if="displayPrint || displayExport" class="print-export" ng-cloak>' +
            '<span ng-if="displayPrint && displayExport" class="">' +
                '<i class="icon icon--mps icon--print" ng-click="printGrid()"></i>' +
                '<a ng-show="!nativePrint" translate="LABEL.COMMON.PRINT" href="#" class="text--small text--semi-bold" ng-click="printGrid()"></a>' +
                '<a ng-show="nativePrint" translate="LABEL.COMMON.PRINT" href="#" class="text--small text--semi-bold" onclick="window.print()"></a>' +
            '</span>' +
            '<div ng-if="displayPrint && !displayExport" class="">' +
                '<i class="icon icon--mps icon--print" ng-click="printGrid()"></i>' +
                '<a ng-show="!nativePrint" translate="LABEL.COMMON.PRINT" href="#" class="text--small text--semi-bold" ng-click="printGrid()"></a>' +
                '<a ng-show="nativePrint" translate="LABEL.COMMON.PRINT" href="#" class="text--small text--semi-bold" onclick="window.print()"></a>' +
            '</div>' +
            '<span ng-if="displayExport && displayPrint" class="">' +
                '<i class="icon icon--mps icon--download" ng-click="exportGrid()"></i>' +
                '<a translate="LABEL.COMMON.EXPORT" href="#" class="text--small text--semi-bold" ng-click="exportGrid()"></a>' +
            '</span>' +
            '<div ng-if="displayExport && !displayPrint" class="">' +
                '<i class="icon icon--mps icon--download" ng-click="exportGrid()"></i>' +
                '<a translate="LABEL.COMMON.EXPORT" href="#" class="text--small text--semi-bold" ng-click="exportGrid()"></a>' +
            '</div>' +
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
            sourceAddress: '@',
            customConfigure: '=',
            showNewAddressTab: '@'
        },
        templateUrl: '/app/utilities/templates/pick-address.html',
        controller: 'AddressPickerController'
    };
})
.directive('addressPickerTabs', function(){
     return {
        restrict: 'A',
        templateUrl: '/app/utilities/templates/address-picker-tabs.html',
        link: function(scope, el, attr){
            var $ = require('jquery'),
                 sets = $(el).find("[data-js=tab], [data-js=set], [data-js=accordion]");
            sets.each(function(i,set){
                $(set).set({});
            });
        }
    };
})
.directive('pickAddressTab', function(){
     return {
        restrict: 'A',
        templateUrl: '/app/utilities/templates/pick-address-tab.html'
    };
})
.directive('newAddressTab', function(){
     return {
        restrict: 'A',
        templateUrl: '/app/utilities/templates/new-address-tab.html',
        controller: 'AddressPickerController'
    };
})
.directive('pickBillToAddress', function(){
     return {
        restrict: 'A',
        scope: {
            selectedAddressTitle: '@',
        },
        templateUrl: '/app/utilities/templates/pick-bill-to-address.html',
        controller: 'AddressBillToPickerController'
    };
})
.directive('pickShipToAddress', function(){
     return {
        restrict: 'A',
        scope: {
            selectedAddressTitle: '@',
        },
        templateUrl: '/app/utilities/templates/pick-ship-to-address.html',
        controller: 'AddressShipToPickerController'
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
.directive('pickAccount', function(){
     return {
        restrict: 'A',
        scope: {
            currentAccountTitle: '@',
            replaceAccountTitle: '@',
            customConfigure: '='
        },
        templateUrl: '/app/utilities/templates/pick-account.html',
        controller: 'AccountPickerController'
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
        },1000);
    };
    return {
        restrict: 'A',
        templateUrl: '/app/utilities/templates/pagination.html',
        link: link
    };
}])
.directive('errorMsg',function(){
	 return {
	        restrict: 'A',
	        template: 	'<div ng-if="errorMessage" class="alert alert--error" data-js="alert">'+
	        			'<span class="alert__close" data-js="alert-close" aria-hidden="true"></span>'+
	        			'<icon class="alert__icon icon icon--small icon--ui icon--error"></icon>'+
	        			'<div class="alert__body"><span>{{errorMessage}}</span></div></div>'
	    };
})
.directive('adminHomeHeight',function(){
     return function (scope, element, attrs) {
        element.height($(document).height() - $('header').outerHeight() - $('footer').outerHeight() - 48);
    }
})
.directive('blankPageHeight',function(){
     return function (scope, element, attrs) {
        element.height($('.site-content').height() - $('footer').outerHeight());
    }
});
