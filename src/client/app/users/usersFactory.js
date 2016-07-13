'use strict';
angular.module('mps.user')
.factory('UserService', [ 'serviceUrl', '$translate', 'HATEOASFactory',
    function(serviceUrl, $translate, HATEOASFactory) {
        var UserService = {
            //TODO: Need to fix translations for Users
            //customize Address
            serviceName: 'users',
            embeddedName: 'users',
            columns: 'default',
            columnDefs: {
                defaultSet: [
                    {'name': $translate.instant('USER_MAN.COMMON.TXT_GRID_STATUS'), 'field': 'activeStatus'},
                    {'name': $translate.instant('USER_MAN.COMMON.TXT_GRID_CREATION_DATE'), 'field':'created'},
                    {'name': $translate.instant('USER_MAN.COMMON.TXT_GRID_USER_ID'), 'field':'userId'},
                    {'name': $translate.instant('USER_MAN.COMMON.TXT_GRID_FIRST_LAST_NAME'),
                     'cellTemplate':'<div>' +
                                    '{{row.entity.lastName}}, {{row.entity.firstName}}' +
                                    '</div>'
                    },
                    {'name': $translate.instant('USER_MAN.COMMON.TXT_GRID_EMAIL'), 'field': 'email'},
                    {'name': $translate.instant('USER_MAN.COMMON.TXT_GRID_COMPANY_ACCOUNT'), 'field': '' },
                    {'name': $translate.instant('USER_MAN.COMMON.TXT_GRID_ROLES'), 'field': '' }
                ]
            },
            route: '/delegated_admin'
        };
        return new HATEOASFactory(UserService);
    }
]);

