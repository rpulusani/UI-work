

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
                    {'name': 'Status', 'field': 'activeStatus'},
                    {'name': 'Creation date', 'field':'created'},
                    {'name': 'User ID', 'field':'userId'},
                    {'name': 'Name (Last, First)',
                     'cellTemplate':'<div>' +
                                    '{{row.entity.lastName}}, {{row.entity.firstName}}' +
                                    '</div>'
                    },
                    {'name': 'Email', 'field': 'email'},
                    {'name': 'Company account', 'field': '' },
                    {'name': 'Roles', 'field': '' }
                ]
            },
            route: '/delegated_admin'
        };
        return new HATEOASFactory(UserService);
    }
]);

