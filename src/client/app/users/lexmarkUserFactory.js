define(['angular', 'user', 'hateoasFactory.serviceFactory', 'utility.formatters'], function(angular) {
    'use strict';
    angular.module('mps.user')
    .factory('LexmarkUser', ['serviceUrl', '$translate', 'HATEOASFactory', 'FormatterService',
        function(serviceUrl, $translate, HATEOASFactory, formatter) {
            var LexmarkUser = {
                serviceName: 'lexmark-administration/employees',
                embeddedName: 'users', //get away from embedded name and move to a function to convert url name to javascript name
                url: serviceUrl + 'lexmark-administration/employees',
                columns: 'default',
                columnDefs: {
                    defaultSet: [
                        {'name': 'First Name', 'field':'firstName'},
                        {'name': 'Last Name', 'field':'lastName'},
                        {'name': 'Email', 'field': 'email',
                         'cellTemplate':'<div>' +
                                            '<a href="#" ng-click="grid.appScope.view(row.entity);" >' +
                                            '{{row.entity.email}}</a>' +
                                        '</div>'
                        }
                    ]
                },
                route: '/delegated_admin'  
            };

        return new HATEOASFactory(LexmarkUser);
    }]);
});
