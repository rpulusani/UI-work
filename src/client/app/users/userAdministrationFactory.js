

angular.module('mps.user')
.factory('UserAdminstration', ['serviceUrl', '$translate', 'HATEOASFactory', 'FormatterService',
    function(serviceUrl, $translate, HATEOASFactory, formatter) {
        var UserAdminstration = {
            serviceName: 'user-administration/users',
            embeddedName: 'users', //get away from embedded name and move to a function to convert url name to javascript name
            url: serviceUrl + 'user-administration/users',
            columns: 'default',
            activeStatus: true,
            hideBookmark: true,
            preventPersonalization: true,
            columnDefs: {
                defaultSet: [
                    {
                        'name': $translate.instant('USER_MAN.COMMON.TXT_GRID_STATUS'), 
                        'field': 'active',
                        'cellTemplate': '<div ng-bind="row.entity.getFormattedStatus()"></div>', 
                        'notSearchable':true,
                        'searchOn': 'status'
                    },
                    {
                        'name': $translate.instant('USER_MAN.COMMON.TXT_GRID_CREATION_DATE'), 
                        'field':'created',
                        'cellTemplate': '<div ng-bind="row.entity.getFormattedCreateDate()"></div>', 
                        'notSearchable':true
                    },
                    {'name': $translate.instant('USER_MAN.COMMON.TXT_GRID_EMAIL'), 'field': 'email', width: 275,
                        'cellTemplate':'<div>' +
                                        '<a href="#" ng-click="grid.appScope.view(row.entity);" >' +
                                        '{{row.entity.email}}</a>' +
                                    '</div>'
                    },
                    {'name': $translate.instant('USER_MAN.COMMON.TXT_GRID_FIRST_NAME'), 'field':'firstName'},
                    {'name': $translate.instant('USER_MAN.COMMON.TXT_GRID_LAST_NAME'), 'field':'lastName'},
                    {
                        'name': $translate.instant('USER_MAN.COMMON.TXT_GRID_COMPANY_ACCOUNT'), 
                        'field': 'accounts', 
                        'cellTemplate': '<div ng-bind="row.entity.getAccounts()"></div>', 
                        'notSearchable':true,
                        'enableSorting':false
                    },
                    {
                        'name': $translate.instant('USER_MAN.COMMON.TXT_GRID_ROLES'), 
                        'field': '_embedded.roles', 
                        'cellTemplate': '<div ng-bind="row.entity.getRoles()"></div>', 
                        'notSearchable':true,
                        'enableSorting':false
                    }
                ],
                impersonateSet: [
                    {'name': $translate.instant('USER_MAN.COMMON.TXT_GRID_USER_ID'), 'field': 'userId', 'notSearchable': true, dynamic: false},
                    {'name': $translate.instant('USER_MAN.COMMON.TXT_GRID_FIRST_NAME'), 'field':'firstName'},
                    {'name': $translate.instant('USER_MAN.COMMON.TXT_GRID_LAST_NAME'), 'field':'lastName'},
                    {
                        'name': $translate.instant('USER_MAN.COMMON.TXT_GRID_COMPANY_ACCOUNT'), 
                        'field': 'accounts', 
                        'cellTemplate': '<div ng-bind="row.entity.getAccounts()"></div>', 
                        'notSearchable':true,
                        'enableSorting':false
                    }
                ],
                invitedSet: [
                    {'name': $translate.instant('USER_MAN.COMMON.TXT_GRID_STATUS'), 'field': 'invitedStatus','notSearchable':true},                    
                    {'name': $translate.instant('USER_MAN.COMMON.TXT_GRID_EMAIL'), 'field': 'email'},
                    {'name': $translate.instant('USER_MAN.COMMON.TXT_GRID_INVITATION_DATE'), 
                        'field':'created',
                        'cellTemplate':'<div ng-bind="row.entity.getFormattedCreateDate()"></div>',
                        'notSearchable':true
                    },
                    {
                        'name': $translate.instant('USER_MAN.COMMON.TXT_GRID_COMPANY_ACCOUNT'), 
                        'field': 'accounts',
                        'cellTemplate':'<div ng-bind="row.entity.getAccounts()"></div>', 
                        'enableSorting':false,
                        'notSearchable':true
                    },
                    {
                        'name': $translate.instant('USER_MAN.COMMON.TXT_GRID_ROLES'), 
                        'field': '_embedded.roles',
                        'cellTemplate': '<div ng-bind="row.entity.getRoles()"></div>', 
                        'notSearchable':true,
                        'enableSorting':false
                    }
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
            route: '/delegated_admin',
            languageOptions:function($translate){
                   return [
                {name: $translate.instant('LANGUAGES.ENGLISH'), code:  'EN'},
                {name: $translate.instant('LANGUAGES.GERMAN'), code:  'DE'},
                {name: $translate.instant('LANGUAGES.SPANISH'), code:  'ES'},
                {name: $translate.instant('LANGUAGES.FRENCH'), code:  'IT'},
                {name: $translate.instant('LANGUAGES.ITALIAN'), code:  'it_IT'},
                {name: $translate.instant('LANGUAGES.PORTUGUESE_BRAZIL'), code:  'PT_BR'},
                {name: $translate.instant('LANGUAGES.PORTUGUESE_PORTUGAL'), code:  'PT_PT'},
                {name: $translate.instant('LANGUAGES.TURKISH'), code:  'TR'},
                {name: $translate.instant('LANGUAGES.CHINESE_SIMPLIFIED'), code:  'ZH_CN'},
                {name: $translate.instant('LANGUAGES.CHINESE_TRADITIONAL'), code:  'ZH_TW'},
                {name: $translate.instant('LANGUAGES.RUSSIAN'), code:  'RU'},
                {name: $translate.instant('LANGUAGES.KOREAN'), code:  'KO'},
                {name: $translate.instant('LANGUAGES.JAPANESE'), code:  'JA'},
             ];
            }
        };

    return new HATEOASFactory(UserAdminstration);
}]);

