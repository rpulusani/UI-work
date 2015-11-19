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
    .directive('pickContact', function(){
         return {
            restrict: 'A',
            scope: {
                title: '@',
                contactSelectText: '@',
                returnPath: '@'
            },
            templateUrl: '/app/utilities/templates/pick-contact.html',
            controller: 'ContactPickerController'
        };
    })
    .directive('selectPageCount', function(){
         return {
            restrict: 'A',
            scope: {
                module: '=',
                readonly: '='
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
    .directive('pagination', function(){
        return {
            restrict: 'A',
            templateUrl: '/app/utilities/templates/pagination.html',
        };
    });
});
