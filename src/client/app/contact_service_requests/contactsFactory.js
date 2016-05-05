
angular.module('mps.serviceRequestContacts')
.factory('Contacts', ['$translate', 'HATEOASFactory', 'FormatterService', '$location', '$rootScope', 'serviceUrl', 'UserService', 'ServiceRequestService',
    function($translate, HATEOASFactory, formatter, $location, $rootScope, serviceUrl, Users, ServiceRequest) {
        var Contacts = {
            serviceName: 'contacts',
            embeddedName: 'contacts',
            url: serviceUrl + 'contacts',
            columns: 'defaultSet',
            hideBookmark: true,
            columnDefs: {
                defaultSet: [
                    {
                        name: $translate.instant('CONTACT.FIRST_NAME'),
                        field: 'firstName',
                        dynamic: false,                        
                        cellTemplate: '<div><a href="#" ng-click="grid.appScope.contacts.goToUpdate(row.entity);" ' +
                            'ng-bind="row.entity.firstName"></a></div>'
                    },
                    {
                        name: $translate.instant('CONTACT.LAST_NAME'),
                        field: 'lastName',
                        dynamic: false,                        
                    },
                    {
                        name: $translate.instant('CONTACT_MAN.MANAGE_CONTACTS.TXT_GRID_PHONE'),
                        field: 'workPhone',
                        searchOn: 'workPhone'
                    },
                    {
                        name: $translate.instant('CONTACT_MAN.MANAGE_CONTACTS.TXT_GRID_EMAIL'),
                        field: 'email',
                        searchOn: 'email'
                    },
                    {
                        name: $translate.instant('CONTACT.ID'),
                        field: 'id',
                        visible: false,
                        dynamic: false,
                        notSearchable: true
                    },
                    
                    {
                        name: $translate.instant('ADDRESS_MAN.COMMON.TXT_ADDRESS_1'),
                        field:'address.addressLine1',
                        cellTemplate:'<div ng-bind="row.entity.address.addressLine1"></div>',
                        notSearchable: true,
                        visible: false
                        
                    },
                    {
                        name: $translate.instant('ADDRESS_MAN.COMMON.TXT_ADDRESS_2'),
                        field:'address.addressLine2',
                        cellTemplate:'<div ng-bind="row.entity.address.addressLine2"></div>',
                        notSearchable: true,
                        visible: false
                    },
                    {
                        name: $translate.instant('ADDRESS.HOUSE_NUMBER'),
                        field:'',
                        notSearchable: true,
                        visible: false
                    },
                    {
                        name: $translate.instant('ADDRESS.CITY'),
                        field:'address.city',
                        cellTemplate:'<div ng-bind="row.entity.address.city"></div>',
                        notSearchable: true,
                        visible: false
                    },
                    {
                        name: $translate.instant('ADDRESS_MAN.COMMON.TXT_STATE'),
                        field:'address.stateFullName',
                        cellTemplate:'<div ng-bind="row.entity.address.stateFullName"></div>',
                        notSearchable: true,
                        visible: false
                    },
                    {
                        name: $translate.instant('ADDRESS.PROVINCE'),
                        field:'address.province',
                        cellTemplate:'<div ng-bind="row.entity.address.province"></div>',
                        notSearchable: true,
                        visible: false
                    },
                    {
                        name: $translate.instant('ADDRESS.COUNTY'),
                        field:'address.county',
                        cellTemplate:'<div ng-bind="row.entity.address.county"></div>',
                        notSearchable: true,
                        visible: false
                    },
                    {
                        name: $translate.instant('ADDRESS.DISTRICT'),
                        field:'address.district',
                        cellTemplate:'<div ng-bind="row.entity.address.district"></div>',
                        notSearchable: true,
                        visible: false
                    },
                    {
                        name: $translate.instant('ADDRESS.COUNTRY'),
                        field:'address.country',
                        cellTemplate:'<div ng-bind="row.entity.address.country"></div>',
                        notSearchable: true,
                        visible: false
                    },
                    {
                        name: $translate.instant('ADDRESS.ZIP_POSTAL'),
                        field:'address.postalCode',
                        cellTemplate:'<div ng-bind="row.entity.address.postalCode"></div>',
                        notSearchable: true,
                        visible: false
                    }
                ]
            },
            route: '/service_requests/contacts',
            goToCreate: function() {
                this.newMessage();
                this.tempSpace = {};

                $location.path('/service_requests/contacts/new');
            },
            goToUpdate: function(contact) {
                ServiceRequest.newMessage();

                if (contact) {
                    this.setItem(contact);
                }

                window.scrollTo(0,0);

                $location.path(this.route + '/' + this.item.id + '/update');
            },
            goToList: function() {
                $location.path(this.route);
            },
            goToDelete: function(contact) {
                    ServiceRequest.reset();
                    ServiceRequest.newMessage();
                    if (contact) {
                        this.setItem(contact);
                    }
                    $location.path(this.route + '/delete/' + this.item.id + '/review');
            },
            verifyAddress: function(addressObj, fn) {
                this.get({
                    method: 'post',
                    url: serviceUrl + 'address-validation',
                    data: addressObj,
                    preventDefaultParams: true,
                    noUpdate: true
                }).then(function(bodsRes) {
                    return fn(bodsRes.status, bodsRes.data);
                });
            },
            functionArray: [
                {
                    name: 'getFullname',
                    functionDef: function() {
                        return formatter.getFullName(this.firstName, this.lastName);
                    }
                },
                {
                    name: 'getWorkPhone',
                    functionDef: function(){
                        return formatter.getPhoneFormat(this.workPhone);
                    }
                },
                {
                    name: 'getAltPhone',
                    functionDef: function(){
                        return formatter.getPhoneFormat(this.alternatePhone);
                    }
                }
            ]
         };

        return new HATEOASFactory(Contacts);
    }
]);
