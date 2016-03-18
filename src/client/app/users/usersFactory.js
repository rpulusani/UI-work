

angular.module('mps.user')
    .factory('UserService', [ 'serviceUrl', '$translate', 'HATEOASFactory','$http', '$q',
        function(serviceUrl, $translate, HATEOASFactory, $http, $q) {
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
                route: '/delegated_admin',

                getProfile: function(loginId){
                    var url = serviceUrl  + 'users/'+ loginId,
                    defer = $q.defer();
                    $http.get(url).then(function(processedResponse) {
                        defer.resolve(processedResponse.data);
                    });
                    return defer.promise;
                },
                updateProfile: function(loginId, userProfile, alternateIdentity){
                    var url = serviceUrl  + 'users/'+ loginId,
                    defer = $q.defer(),
                    options = {
                            'method': 'PUT',
                            'url': url,
                            'data': userProfile
                    };

                    $http(options).then(function(processedResponse){
                        defer.resolve(processedResponse.data);
                    });
                    return defer.promise;
                }
        };
        return new HATEOASFactory(UserService);
    }
]);

