

angular.module('mps.queue')
.factory('TombstoneService', ['serviceUrl', '$translate', 'HATEOASFactory', 'FormatterService',
    function(serviceUrl, $translate, HATEOASFactory, formatter) {
        var Tombstones = {
                serviceName: 'tombstones',
                embeddedName: 'tombstones', //this is an issue with getting and receiving tombstone(s)
                columns: 'defaultSet',
                columnDefs: {
                    defaultSet: [
                        {'name': 'id', 'field': 'id', visible:false, 'notSearchable': true},
                        {'name': $translate.instant('QUEUE.COMMON.COLUMN_DATE'),
                            'field': 'getFormattedCreateDate()', 'notSearchable': true},
                        {'name': $translate.instant('QUEUE.COMMON.COLUMN_TYPE'), 'field':'kind'},
                        {'name': $translate.instant('QUEUE.COMMON.COLUMN_REQUESTOR_NAME'),
                            'field': 'getFullRequestorName()', 'notSearchable': true},
                        {'name': $translate.instant('QUEUE.COMMON.COLUMN_PRIMARY_CONTACT'),
                            'field': 'getFullPrimaryName()',visible: true, 'notSearchable': true},
                        {'name': $translate.instant('QUEUE.COMMON.COLUMN_ACCOUNT'),
                            'field': '',visible: false, 'notSearchable': true}
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

