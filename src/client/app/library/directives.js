define(['angular', 'library'], function(angular) {
    'use strict';
    angular.module('mps.library')
    .directive('fileOnChange', function() {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var onChangeFunc = scope.$eval(attrs.fileOnChange);
                element.bind('change', onChangeFunc);
            }
        };
    })
    .directive('libraryInlineDelete', function() {
        return {
            restrict: 'A',
            templateUrl: '/app/library/templates/library-inline-delete.html',
            replace: true,
            scope: { onConfirmDelete: '&' },
            controller: 'libraryDeleteInlineController',
        };
    })
    .directive('libraryViewFields', function() {
        return {
            restrict: 'A',
            templateUrl: '/app/library/templates/library-view-fields.html'
        };
    })
    .directive('libraryQueryFields', function() {
        return {
            restrict: 'A',
            templateUrl: '/app/library/templates/library-query-fields.html'
        };
    })
    .directive('libraryNewFields', function() {
        return {
            restrict: 'A',
            templateUrl: '/app/library/templates/library-new-fields.html'
        };
    });
});
