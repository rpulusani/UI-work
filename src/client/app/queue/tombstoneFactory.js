

angular.module('mps.queue')
.factory('TombstoneService', ['serviceUrl', '$translate', 'HATEOASFactory', 'FormatterService',
    function(serviceUrl, $translate, HATEOASFactory, formatter) {
        var Tombstones = {
                serviceName: 'tombstones',
                embeddedName: 'tombstones', //this is an issue with getting and receiving tombstone(s)
                columns: 'defaultSet',
                preventPersonalization: true,
                columnDefs: {
                    defaultSet: [
                        {'name': 'id', 'field': 'id', visible:false, 'notSearchable': true},
                        {'name': $translate.instant('QUEUE.COMMON.COLUMN_DATE'),
                            'field': 'getFormattedCreateDate()', 
                            'searchOn': 'created', 
                            'notSearchable': true},
                        {'name': $translate.instant('QUEUE.COMMON.COLUMN_TYPE'), 'field':'kind'},
                        {'name': $translate.instant('QUEUE.COMMON.COLUMN_REQUESTER_FIRST_NAME'),
                            'field':'_embedded.requester.firstName',
                            'searchOn':'requester.firstName',
                            'cellTemplate':'<div ng-bind="row.entity._embedded.requester.firstName"></div>',
                            'notSearchable': true
                        },
                        {'name': $translate.instant('QUEUE.COMMON.COLUMN_REQUESTER_LAST_NAME'), 
                            'field':'_embedded.requester.lastName', 
                            'searchOn':'requester.lastName',
                            'cellTemplate':'<div ng-bind="row.entity._embedded.requester.lastName"></div>',
                            'notSearchable': true
                        },
                        {'name': $translate.instant('QUEUE.COMMON.COLUMN_CONTACT_FIRST_NAME'),
                            'field':'_embedded.primaryContact.firstName',
                            'searchOn':'primaryContact.firstName',
                            'cellTemplate':'<div ng-bind="row.entity._embedded.primaryContact.firstName"></div>',
                            'visible': true,
                            'notSearchable': true
                        },
                        {'name': $translate.instant('QUEUE.COMMON.COLUMN_CONTACT_LAST_NAME'), 
                            'field':'_embedded.primaryContact.lastName', 
                            'searchOn':'primaryContact.lastName',
                            'cellTemplate':'<div ng-bind="row.entity._embedded.primaryContact.lastName"></div>',
                            'visible': true,
                            'notSearchable': true
                        },
                        {'name': $translate.instant('QUEUE.COMMON.COLUMN_ACCOUNT'),
                            'field': '', visible: false, 'notSearchable': true}
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
                        name: 'getFullPrimaryName',
                        functionDef: function() {
                            if(this._embedded && this._embedded.primaryContact){
                                return formatter.getFullName(this._embedded.primaryContact.firstName,
                                    this._embedded.primaryContact.lastName,
                                    this._embedded.primaryContact.middleName);
                            }else{
                                return '';
                            }
                        }
                    },
                    {
                        name: 'getFullRequestorName',
                        functionDef: function() {
                            if(this._embedded && this._embedded.requester){
                                return formatter.getFullName(this._embedded.requester.firstName,
                                    this._embedded.requester.lastName,
                                    this._embedded.requester.middleName);
                            }else{
                                return '';
                            }
                        }
                    }
                ],

                route: '/queue'
        };

    return  new HATEOASFactory(Tombstones);
}]);

