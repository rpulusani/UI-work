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
    .directive('pagination', function(){
        return{
            restrict: 'A',
            templateUrl: '/app/utilities/templates/pagination.html',
        };
    });
});
