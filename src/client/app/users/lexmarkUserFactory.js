

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
                    {'name': $translate.instant('USER_MAN.MANAGE_LXK_USERS.TXT_GRID_SHORT_NAME'), 'field':'shortName'},
                    {'name': $translate.instant('USER_MAN.MANAGE_LXK_USERS.TXT_GRID_EMAIL'), 'field': 'email',
                     'cellTemplate':'<div>' +
                                        '<a href="#" ng-click="grid.appScope.view(row.entity);" >' +
                                        '{{row.entity.email}}</a>' +
                                    '</div>'
                    },
                    {'name': $translate.instant('USER_MAN.MANAGE_LXK_USERS.TXT_GRID_FIRST_NAME'), 'field':'firstName'},
                    {'name': $translate.instant('USER_MAN.MANAGE_LXK_USERS.TXT_GRID_LAST_NAME'), 'field':'lastName'}
                    
                ]
            },
            route: '/delegated_admin/lexmark_user'
        };

    return new HATEOASFactory(LexmarkUser);
}]);

