

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
                        functionDef: function() {
                            if (this.startDate === undefined || this.startDate === null) { return; }

                            var dy = this.startDate.replace(/\+[0]*/, "") + 'Z';
                            var d = new Date(dy);
                            return formatter.getDisplayDate(d);
                        }
                    },
                    {
                        name: 'getFormattedEndDate',
                        functionDef: function() {
                            if (this.endDate === undefined || this.endDate === null) { return; }

                            var dy = this.endDate.replace(/\+[0]*/, "") + 'Z';
                            var d = new Date(dy);
                            return formatter.getDisplayDate(d);
                        }                        
                    }
                ],

                route: '/notifications'
        };

    return  new HATEOASFactory(Notifications);
}]);

