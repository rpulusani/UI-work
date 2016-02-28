

angular.module('mps.notifications')
.factory('Notifications', ['adminUrl', '$translate', 'HATEOASFactory', 'FormatterService',
    function(adminUrl, $translate, HATEOASFactory, formatter) {
        var Notifications = {
                serviceName: 'notifications',
                embeddedName: 'contents', //get away from embedded name and move to a function to convert url name to javascript name
                columns: 'defaultSet',
                url: adminUrl + 'notifications',
                columnDefs: {
                    defaultSet: [
                        {'name': 'id', 'field': 'id', visible:false, 'notSearchable': true},
                        {'name': $translate.instant('PORTAL_ADMIN.DISPLAY_ORDER'), 'field': 'order', 'notSearchable': true},
                        {'name': 'Move', 'field':'order',
                         'cellTemplate':'<div>' +
                                        '<span class="item-icon icon icon-psw-up-arrow"></span>' +
                                        '<span class="item-icon icon icon-psw-down-arrow"></span>' +
                                    '</div>'
                        },
                        {'name': $translate.instant('PORTAL_ADMIN.START_DATE'), 'field': 'getFormattedStartDate()', 'notSearchable': true},
                        {'name': $translate.instant('PORTAL_ADMIN.END_DATE'), 'field': 'getFormattedEndDate()', 'notSearchable': true},
                        {'name': $translate.instant('PORTAL_ADMIN.NAME'), 'field': 'subModule.subModuleName',
                          'cellTemplate':'<div>' +
                                        '<a href="#" ng-click="grid.appScope.view(row.entity);" ' +
                                        '>{{row.entity.subModule.subModuleName}}</a>' +
                                    '</div>'
                        },
                        {'name': ' ', 'field': 'assetId',
                         'cellTemplate':'<div>' +
                            '<a href="#" ng-click="grid.appScope.delete(row.entity);" ' +
                            '>{{"PORTAL_ADMIN.DELETE_NOTIFICATION" | translate}}</a>' +
                        '</div>', 'notSearchable': true}
                    ]
                },

                functionArray: [
                    {
                        name: 'getFormattedStartDate',
                        functionDef: function(){
                            return formatter.formatDate(this.startDate);
                        }
                    },
                    {
                        name: 'getFormattedEndDate',
                        functionDef: function(){
                            return formatter.formatDate(this.endDate);
                        }
                    }
                ],

                route: '/notifications'
        };

    return  new HATEOASFactory(Notifications);
}]);

