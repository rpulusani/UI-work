define(['angular'], function(angular) {
    'use strict';
    angular.module('mps.library', []).config(['$routeProvider', function ($routeProvider) {
        $routeProvider
        .when('/library', {
            templateUrl: '/app/library/templates/view.html',
            activeItem: '/library',
            controller: 'LibraryListController'
        })
        .when('/library/:id/view', {
            templateUrl: '/app/library/templates/view-document.html',
            activeItem: '/library',
            controller: 'LibraryViewController'
        })
        .when('/library/:id/update', {
            templateUrl: '/app/library/templates/new_update.html',
            controller: 'LibraryController',
            activeItem: '/library',
            resolve: {
                translationPlaceHolder: function(){
                    return {
                        h1:'DOCUMENT_LIBRARY.MANAGING_DOCUMENT.TXT_MANAGING_DOCUMENT',
                        paragraph: 'DOCUMENT_LIBRARY.MANAGING_DOCUMENT.TXT_MANAGING_DOCUMENT_PAR',
                        submit: 'DOCUMENT_LIBRARY.MANAGING_DOCUMENT.BTN_SAVE_DOC_CHANGES',
                        cancel: 'DOCUMENT_LIBRARY.MANAGING_DOCUMENT.BTN_DISCARD_DOC_CHANGES'
                    };
                }
            }
        })
        .when('/library/new', {
            templateUrl: '/app/library/templates/new_update.html',
            controller: 'LibraryController',
            activeItem: '/library',
            resolve: {
                translationPlaceHolder: function(){
                    return {
                        h1:'DOCUMENT_LIBRARY.ADD_NEW_DOCUMENT.TXT_ADD_NEW_DOCUMENT',
                        paragraph: 'DOCUMENT_LIBRARY.ADD_NEW_DOCUMENT.TXT_ADD_NEW_DOCUMENT_PAR',
                        submit: 'DOCUMENT_LIBRARY.MANAGING_DOCUMENT.BTN_SAVE_DOC_CHANGES',
                        cancel: 'DOCUMENT_LIBRARY.MANAGING_DOCUMENT.BTN_DISCARD_DOC_CHANGES'
                    };
                }
            }
        })
        .when('/library/tags', {
            templateUrl: '/app/library/templates/library-tags.html',
            activeItem: '/library',
            controller: 'LibraryTagController'
        });
    }]);
});
