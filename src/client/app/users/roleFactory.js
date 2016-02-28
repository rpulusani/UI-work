

angular.module('mps.user')
.factory('Roles', ['$resource', 'serviceUrl', 'HATEOASFactory',
    function($resource, serviceUrl, HATEOASFactory) {
        var Roles = {
            serviceName: 'roles',
            embeddedName: 'roles',
            url: serviceUrl + 'roles',
            columns: [],
            route: ''
        };
        return new HATEOASFactory(Roles);
   }
]);

