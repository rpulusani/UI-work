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
    .directive('libraryViewFields', function() {
        return {
            restrict: 'A',
            templateUrl: '/app/library/templates/library-view-fields.html'
        };
    })
    .directive('libraryNewFields', function() {
        return {
            restrict: 'A',
            templateUrl: '/app/library/templates/library-new-fields.html'
        };
    });
});
