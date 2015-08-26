'use strict';
angular.module('mps.serviceRequestContacts')
.factory('ContactService', ['$resource', 'mpsApiUri',
    function($resource, mpsApiUri) {
        var url = mpsApiUri + '/accounts/:accountId/contacts/:id';
        return $resource(url, {accountId: '@accountId', id: '@id'}, {
            'update': { method: 'PUT' }
        });
    }
]);
