define(['angular', 'user'], function(angular) {
    'use strict';
    angular.module('mps.user')
    .factory('UserService', [ 'serviceUrl', '$translate', 'HATEAOSFactory',
        function(serviceUrl, $translate, HATEAOSFactory) {
            var UserService = {

                //customize Address
                serviceName: 'users',
                columns: [
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

                route: '/delegated_admin'
            };

            return new HATEAOSFactory(UserService);
        }
    ]);
});

