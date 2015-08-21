'use strict';
angular.module('mps.serviceRequestContacts')
.factory('ContactService', ['$http', '$resource', 'mpsApiUri',
    function($http, $resource, mpsApiUri) {
        var url = mpsApiUri + '/accounts/:accountId/contacts/:id';
        return $resource(url, {accountId: '@accountId', id: '@id'}, {
            'update': { method: 'PUT' }
        });
    }
]);
