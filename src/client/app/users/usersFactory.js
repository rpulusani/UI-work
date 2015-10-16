define(['angular', 'user', 'utility.gridCustomizationService'], function(angular) {
    'use strict';
    angular.module('mps.user')
    .factory('UserService', [ 'serviceUrl', '$translate', '$http', 'SpringDataRestAdapter',
        'gridCustomizationService',
        function(serviceUrl, $translate, $http, SpringDataRestAdapter, gridCustomizationService) {
            var UserService = function(){

                //customize Address
                this.bindingServiceName = "userService";
                this.columns = {
                    'defaultSet':[
                        {'name': $translate.instant('LABEL.STATUS'), 'field': 'activeStatus'},
                        {'name': $translate.instant('LABEL.CREATED_DATE'), 'field':'created'},
                        {'name': $translate.instant('LABEL.USER_ID'), 'field':'userId'},
                        {'name': $translate.instant('LABEL.NAME_LAST_FIRST'), 
                         'cellTemplate':'<div>' +
                                        '{{row.entity.lastName}}, {{row.entity.firstName}}' +
                                        '</div>'
                        },
                        {'name': $translate.instant('LABEL.EMAIL'), 'field': 'email'},
                        {'name': $translate.instant('LABEL.COMPANY_ACCT'), 'field': '' },
                        {'name': $translate.instant('LABEL.ROLE'), 'field': '' }
                    ],
                    bookmarkColumn: 'getBookMark()'
                };

                this.templatedUrl =  '/users';
                this.paramNames = ['page', 'sort', 'size', 'type'];
            };

            UserService.prototype = gridCustomizationService;

            return new UserService();
        }
    ]);
});

