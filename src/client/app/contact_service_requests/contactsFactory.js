define(['angular', 'contact'], function(angular, contact) {
    'use strict';
    angular.module('mps.serviceRequestContacts')
    .factory('Contacts', ['serviceUrl', '$translate', 'HATEAOSFactory',
        function(serviceUrl, $translate, HATEAOSFactory) {
            var Contacts = {
                serviceName: 'contacts',
                columns: [
                    {
                        'name': $translate.instant('CONTACT.FULLNAME'),
                        'field': '',
                        'cellTemplate': 
                            '<div>' +
                                '<a href="" ng-click="grid.appScope.goToUpdate(row.entity)" ' +
                                'ng-bind="row.entity.lastName + \', \' +  row.entity.firstName"></a>' +
                            '</div>'
                    },
                    {'name': $translate.instant('CONTACT.ADDRESS'), 'field': 'address'},
                    {'name': $translate.instant('CONTACT.WORK_PHONE'), 'field': 'workPhone'},
                    {'name': $translate.instant('CONTACT.ALT_PHONE'), 'field': 'alternatePhone'},
                    {'name': $translate.instant('CONTACT.EMAIL'), 'field': 'email'}
                ],
                route: '/service_requests/contacts'
            };

            return new HATEAOSFactory(Contacts);
        }
    ]);
});
