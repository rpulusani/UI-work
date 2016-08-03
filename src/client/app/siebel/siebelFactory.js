

angular.module('mps.siebel')
.factory('SiebelValues', ['adminUrl', '$translate', 'HATEOASFactory', 'FormatterService',
    function(adminUrl, $translate, HATEOASFactory, formatter) {
        var SiebelValues = {
                serviceName: 'siebelvalues',
                embeddedName: 'contents', //get away from embedded name and move to a function to convert url name to javascript name
                columns: 'defaultSet',
                url: adminUrl + 'siebelvalues',
                preventPersonalization: true,
                columnDefs: {
                    defaultSet: [
                        {'name': 'id', 'field': 'id', visible:false, 'notSearchable': true},
                        {'name': $translate.instant('PORTAL_ADMIN.OPTION'), 'field': 'subModule.subModuleName', 'notSearchable': true},
                        {'name': $translate.instant('PORTAL_ADMIN.VALUE'), 'field': 'actualValue',
                        'cellTemplate':'<div>' +
                                        '<a href="#" ng-click="grid.appScope.view(row.entity);" ' +
                                        '>{{row.entity.actualValue}}</a>' +
                                    '</div>'

                        },
                        {'name': $translate.instant('PORTAL_ADMIN.DISPLAY_VALUE'), 'field': 'defaultText'},
                        {'name': ' ', 'field': 'defaultText',
                         'cellTemplate':'<div>' +
                            '<a href="#" ng-click="grid.appScope.delete(row.entity);" ' +
                            '>{{"PORTAL_ADMIN.DELETE_VALUE" | translate}}</a>' +
                        '</div>', 
                        'notSearchable': true,
                        'enableSorting': false}
                    ]
                },
                route: '/siebel'
        };

    return  new HATEOASFactory(SiebelValues);
}]);

