define(['angular', 'user', 'hateoasFactory.serviceFactory', 'utility.formatters'], function(angular) {
    'use strict';
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
                        {'name': 'Status', 'field': 'getFormattedStatus()', 'notSearchable':true},
                        {'name': 'Creation date', 'field':'getFormattedCreateDate()', 'notSearchable':true},
                        {'name': 'User ID', 'field': 'userId', 'notSearchable': true, dynamic: false,
                         'cellTemplate':'<div>' +
                                            '<a href="#" ng-click="grid.appScope.view(row.entity);" >' +
                                            '{{row.entity.userId}}</a>' +
                                        '</div>'
                        },
                        {'name': 'First Name', 'field':'firstName'},
                        {'name': 'Last Name', 'field':'lastName'},
                        {'name': 'Email', 'field': 'email'},
                        {'name': 'Company account', 'field': 'getAccounts()', 'notSearchable':true},
                        {'name': 'Roles', 'field': 'getRoles()', 'notSearchable':true}
                    ],
                    invitedSet: [
                        {'name': 'Status', 'field': 'invitedStatus','notSearchable':true},
                        {'name': 'Invitation date', 'field':'getFormattedCreateDate()'},
                        {'name': 'Email', 'field': 'email'},
                        {'name': 'Company account', 'field': 'getAccounts()', 'notSearchable':true},
                        {'name': 'Roles', 'field': 'getRoles()', 'notSearchable':true}
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
});
