define(['angular', 'utility'], function(angular) {
    'use strict';
    angular.module('mps.utility')
    .directive('confirmCancel', function(){
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
            controller: 'confirmCancelController'
        };
    })
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
                module: '='
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
    })
    .directive('draw', function() {
        return {
            restrict: 'A',
            link: function(scope, element, attributes) {
                console.log(element);
                var r = Raphael(element);
                r.piechart(0, 0, 100, [55, 20, 13, 32, 5, 1, 2]);
            }
        };
    });
});
