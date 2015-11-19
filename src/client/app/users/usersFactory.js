define(['angular', 'user', 'hateoasFactory.serviceFactory'], function(angular) {
    'use strict';
    angular.module('mps.user')
    .factory('UserService', [ 'serviceUrl', '$translate', 'HATEOASFactory', 'HATEAOSConfig', '$http', '$q',
        function(serviceUrl, $translate, HATEOASFactory, HATEAOSConfig, $http, $q) {
            var UserService = {

                //customize Address
                serviceName: 'users',
                embeddedName: 'users',
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
                getLoggedInUserInfo: function(loginId){
                    var self  = this,
                    deferred = $q.defer(),
                    url = '';

                    HATEAOSConfig.getApi(self.serviceName).then(function(api) {
                        self.url = api.url;
                        url = self.url + '/' + loginId;
                        $http.get(url).then(function(processedResponse) {
                            self.item = processedResponse;
                            self.processedResponse = processedResponse;

                            deferred.resolve(self);
                        });
                    });

                    return deferred.promise;
                },
                route: '/delegated_admin'
            };

            return new HATEOASFactory(UserService);
        }
    ]);
});
