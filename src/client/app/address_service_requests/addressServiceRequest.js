define(['angular'], function(angular) {
    'use strict';
    angular.module('mps.serviceRequestAddresses', []).config(['$routeProvider',
        function ($routeProvider) {
            $routeProvider
            .when('/service_requests/addresses', {
                templateUrl: '/app/address_service_requests/templates/view.html',
                controller: 'AddressListController'
            })
            .when('/service_requests/addresses/:id/delete', {
                templateUrl: '/app/address_service_requests/templates/review.html',
                controller: 'AddressController',
                activeItem: '/service_requests/addresses',
                resolve: {
                     translationPlaceHolder: function(){
                        return {
                            h1:'ADDRESS_SERVICE_REQUEST.DELETE',
                            paragraph: 'ADDRESS_SERVICE_REQUEST.DELETE_PARAGRAPH',
                            submit: 'ADDRESS_SERVICE_REQUEST.DELETE_SUBMIT',
                            cancel: 'ADDRESS_SERVICE_REQUEST.ABANDON'
                        };
                    },
                    allowMakeChange: function(){
                        return false;
                    }
                }
            })
            .when('/service_requests/addresses/new', {
                templateUrl: '/app/address_service_requests/templates/new_update.html',
                controller: 'AddressController',
                activeItem: '/service_requests/addresses',
                 resolve: {
                    translationPlaceHolder: function(){
                        return {
                            h1:'ADDRESS_SERVICE_REQUEST.ADD',
                            paragraph: 'ADDRESS_SERVICE_REQUEST.ADD_PARAGRAPH',
                            submit: 'LABEL.REVIEW_SUBMIT',
                            cancel: 'ADDRESS_SERVICE_REQUEST.ABANDON'
                        };
                    },
                    allowMakeChange: function(){
                        return false;
                    }
                }
            })
            .when('/service_requests/addresses/:id/review', {
                templateUrl: '/app/address_service_requests/templates/review.html',
                controller: 'AddressController',
                activeItem: '/service_requests/addresses',
                resolve: {
                     translationPlaceHolder: function(){
                        return {
                            h1:'ADDRESS_SERVICE_REQUEST.CHANGE',
                            paragraph: 'ADDRESS_SERVICE_REQUEST.UPDATE_PARAGRAPH',
                            submit: 'LABEL.REVIEW_SUBMIT',
                            cancel: 'ADDRESS_SERVICE_REQUEST.ABANDON'
                        };
                    },
                    allowMakeChange: function(){
                        return false;
                    }
                }
            })
            .when('/service_requests/addresses/:id/submitted', {
                templateUrl: '/app/address_service_requests/templates/submitted.html',
                controller: 'AddressController',
                activeItem: '/service_requests/addresses'
            })
            .when('/service_requests/addresses/:id/update', {
                templateUrl: '/app/address_service_requests/templates/new_update.html',
                controller: 'AddressController',
                activeItem: '/service_requests/addresses',
                 resolve: {
                    translationPlaceHolder: function(){
                        return {
                            h1:'ADDRESS_SERVICE_REQUEST.UPDATE',
                            paragraph: 'ADDRESS_SERVICE_REQUEST.UPDATE_PARAGRAPH',
                            submit: 'LABEL.REVIEW_SUBMIT',
                            cancel: 'ADDRESS_SERVICE_REQUEST.ABANDON'
                        };
                    },
                    allowMakeChange: function(){
                        return false;
                    }
                }
            })
            .when('/service_requests/addresses/:id/verify', {
                templateUrl: '/app/address_service_requests/templates/address-bod.html',
                controller: 'AddressController',
                activeItem: '/service_requests/addresses',
                 resolve: {
                    translationPlaceHolder: function(){
                        return {
                            h1:'ADDRESS_SERVICE_REQUEST.ADD',
                            paragraph: 'ADDRESS_SERVICE_REQUEST.ADD_PARAGRAPH',
                            submit: 'LABEL.REVIEW_SUBMIT',
                            cancel: 'ADDRESS_SERVICE_REQUEST.ABANDON'
                        };
                    },
                    allowMakeChange: function(){
                        return true;
                    }
                }
            });
        }
    ]);
});
