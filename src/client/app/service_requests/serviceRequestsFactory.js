define(['angular', 'serviceRequest', 'hateoasFactory.serviceFactory', 'utility.formatters'], function(angular) {
    'use strict';
    angular.module('mps.serviceRequests')
    .factory('ServiceRequestService', ['serviceUrl', '$translate', 'HATEOASFactory', 'FormatterService',
        function(serviceUrl, $translate, HATEOASFactory, formatter) {
            var ServiceRequests = {
                    serviceName: 'service-requests',
                    embeddedName: 'serviceRequests', //get away from embedded name and move to a function to convert url name to javascript name
                    columns: 'defaultSet',
                    columnDefs: {
                        defaultSet: [
                            {'name': 'id', 'field': 'id', visible:false},
                            {'name': $translate.instant('LABEL.DATE'), 'field': 'getFormattedCreateDate()'},
                            {'name': $translate.instant('SERVICE_REQUEST.REQUEST_NUMBER'), 'field':'requestNumber'},
                            {'name': $translate.instant('LABEL.TYPE'), 'field':'type'},
                            {'name': $translate.instant('LABEL.STATUS'), 'field':'status'},
                            {'name': $translate.instant('SERVICE_REQUEST.PRIMARY_CONTACT'), 'field': ''}
                        ],
                        madcSet: [
                            {'name': 'id', 'field': 'id', visible:false},
                            {'name': $translate.instant('LABEL.DATE'), 'field': 'getFormattedCreateDate()'},
                            {'name': $translate.instant('SERVICE_REQUEST.REQUEST_NUMBER'), 'field':'requestNumber'},
                            {'name': $translate.instant('LABEL.TYPE'), 'field':'type'},
                            {'name': $translate.instant('LABEL.STATUS'), 'field':'status'},
                            {'name': $translate.instant('SERVICE_REQUEST.HELPDESK_REFERENCE'), 'field':'customerReferenceId'},
                            {'name': $translate.instant('SERVICE_REQUEST.COST_CENTER'), 'field':'costCenter'}
                        ],
                        breakfixSet: [
                            {'name': 'id', 'field': 'id', visible:false},
                            {'name': $translate.instant('LABEL.DATE'), 'field': 'getFormattedCreateDate()'},
                            {'name': $translate.instant('SERVICE_REQUEST.REQUEST_NUMBER'), 'field':'requestNumber'},
                            {'name': $translate.instant('LABEL.STATUS'), 'field':'status'},
                            {'name': $translate.instant('DEVICE_SERVICE_REQUEST.PROBLEM_DESCRIPTION'), 'field':'description'},
                            {'name': $translate.instant('DEVICE_SERVICE_REQUEST.RESOLUTION'), 'field':''},
                            {'name': $translate.instant('SERVICE_REQUEST.COST_CENTER'), 'field':'costCenter'}
                        ]
                    },

                    functionArray: [
                        {
                            name: 'getFormattedCreateDate',
                            functionDef: function(){
                                return formatter.formatDate(this.createDate);
                            }
                        }
                    ],

                    route: '/service_requests'
            };

        return  new HATEOASFactory(ServiceRequests);
    }]);
});
