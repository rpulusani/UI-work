

angular.module('mps.user')
.factory('UserAdminstration', ['serviceUrl', '$translate', 'HATEOASFactory', 'FormatterService',
    function(serviceUrl, $translate, HATEOASFactory, formatter) {
        var UserAdminstration = {
            serviceName: 'user-administration/users',
            embeddedName: 'users', //get away from embedded name and move to a function to convert url name to javascript name
            url: serviceUrl + 'user-administration/users',
            columns: 'default',
            columnDefs: {
                defaultSet: [
                    {'name': $translate.instant('USER_MAN.COMMON.TXT_GRID_STATUS'), 'field': 'getFormattedStatus()', 'notSearchable':true},
                    {'name': $translate.instant('USER_MAN.COMMON.TXT_GRID_CREATION_DATE'), 'field':'getFormattedCreateDate()', 'notSearchable':true},
                    {'name': $translate.instant('USER_MAN.COMMON.TXT_GRID_USER_ID'), 'field': 'userId', 'notSearchable': true, dynamic: false,
                     'cellTemplate':'<div>' +
                                        '<a href="#" ng-click="grid.appScope.view(row.entity);" >' +
                                        '{{row.entity.userId}}</a>' +
                                    '</div>'
                    },
                    {'name': $translate.instant('USER_MAN.COMMON.TXT_GRID_FIRST_NAME'), 'field':'firstName'},
                    {'name': $translate.instant('USER_MAN.COMMON.TXT_GRID_LAST_NAME'), 'field':'lastName'},
                    {'name': $translate.instant('USER_MAN.COMMON.TXT_GRID_EMAIL'), 'field': 'email'},
                    {'name': $translate.instant('USER_MAN.COMMON.TXT_GRID_COMPANY_ACCOUNT'), 'field': 'getAccounts()', 'notSearchable':true},
                    {'name': $translate.instant('USER_MAN.COMMON.TXT_GRID_ROLES'), 'field': 'getRoles()', 'notSearchable':true}
                ],
                impersonateSet: [
                    {'name': $translate.instant('USER_MAN.COMMON.TXT_GRID_USER_ID'), 'field': 'userId', 'notSearchable': true, dynamic: false},
                    {'name': $translate.instant('USER_MAN.COMMON.TXT_GRID_FIRST_NAME'), 'field':'firstName'},
                    {'name': $translate.instant('USER_MAN.COMMON.TXT_GRID_LAST_NAME'), 'field':'lastName'},
                    {'name': $translate.instant('USER_MAN.COMMON.TXT_GRID_EMAIL'), 'field': 'email'},
                    {'name': $translate.instant('USER_MAN.COMMON.TXT_GRID_COMPANY_ACCOUNT'), 'field': 'getAccounts()', 'notSearchable':true}
                ],
                invitedSet: [
                    {'name': $translate.instant('USER_MAN.COMMON.TXT_GRID_STATUS'), 'field': 'invitedStatus','notSearchable':true},
                    {'name': $translate.instant('USER_MAN.COMMON.TXT_GRID_INVITATION_DATE'), 'field':'created',
                             'cellTemplate':'<div ng-bind="row.entity.getFormattedCreateDate()"></div>',
                             'notSearchable':true
                    },
                    {'name': $translate.instant('USER_MAN.COMMON.TXT_GRID_EMAIL'), 'field': 'email'},
                    {'name': $translate.instant('USER_MAN.COMMON.TXT_GRID_COMPANY_ACCOUNT'), 'field': 'getAccounts()', 'notSearchable':true},
                    {'name': $translate.instant('USER_MAN.COMMON.TXT_GRID_ROLES'), 'field': 'getRoles()', 'notSearchable':true}
                ]
            },
            functionArray: [
                {
                    name: 'getFormattedCreateDate',
                    functionDef: function(){
                        return formatter.formatDate(this.created);
                    }
                },
                {
                    name: 'getFormattedStatus',
                    functionDef: function(){
                        return formatter.formatStatus(this.active);
                    }
                },
                {
                    name: 'getAccounts',
                    functionDef: function() {
                        if(this.accounts && this.accounts.length){
                            var accountList = [], accountListStr = '';
                            for (var i=0;i<this.accounts.length; i++) {
                               accountList.push(this.accounts[i].name);
                            }
                            var accountListStr = accountList.join(", ");
                            return accountListStr;
                        }else{
                            return '';
                        }
                    }
                },
                {
                    name: 'getRoles',
                    functionDef: function() {
                        if(this._embedded && this._embedded.roles){
                            var roleList = [], roleListStr = '';
                            for (var i=0;i<this._embedded.roles.length; i++) {
                               roleList.push(this._embedded.roles[i].description);
                            }
                            roleListStr = roleList.join(", ");
                            return roleListStr;
                        }else{
                            return '';
                        }
                    }
                }
            ],
            route: '/delegated_admin'
        };

    return new HATEOASFactory(UserAdminstration);
}]);

