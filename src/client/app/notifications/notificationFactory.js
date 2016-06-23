

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
                        {'name': $translate.instant('PORTAL_ADMIN.DISPLAY_ORDER'), 'field': 'order', visible:false, 'notSearchable': true},
                        {'name': $translate.instant('PORTAL_ADMIN.START_DATE'), 'field': 'getFormattedStartDate()', 'searchOn': 'startDate', 'notSearchable': true},
                        {'name': $translate.instant('PORTAL_ADMIN.END_DATE'), 'field': 'getFormattedEndDate()', 'searchOn': 'endDate', 'notSearchable': true},
                        {'name': $translate.instant('PORTAL_ADMIN.NAME'), 'field': 'subModule.subModuleName',
                          'cellTemplate':'<div>' +
                                        '<a href="#" ng-click="grid.appScope.view(row.entity);" ' +
                                        '>{{row.entity.subModule.subModuleName}}</a>' +
                                    '</div>'
                        },
                        {'name': ' ', 'field': 'assetId',
                         'cellTemplate':'<div>' +
                            '<a href="#" ' +
                            'notification-inline-delete on-confirm-delete="grid.appScope.delete(row.entity);"></a>' +
                        '</div>', 'notSearchable': true, 'enableSorting': false}
                    ]
                },

                functionArray: [
                    {
                        name: 'getFormattedStartDate',
                        functionDef: function() {
                            if (this.startDate === undefined || this.startDate === null) { return; }
                            return formatter.formatUTCToDisplay(this.startDate);
                        }
                    },
                    {
                        name: 'getFormattedEndDate',
                        functionDef: function() {
                            if (this.endDate === undefined || this.endDate === null) { return; }
                            return formatter.formatUTCToDisplay(this.endDate);
                        }                        
                    }
                ],

                route: '/notifications'
        };

    return  new HATEOASFactory(Notifications);
}]);

