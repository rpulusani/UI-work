'use strict';
angular.module('mps.user')
.factory('UserService', ['$resource', 'serviceUrl',
    function($resource, serviceUrl) {
        var url = serviceUrl + 'users/:userId';
        return $resource(url, {userId: '@userId'}, {});
    }
]);
