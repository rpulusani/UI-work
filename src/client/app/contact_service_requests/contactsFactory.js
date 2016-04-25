
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
                        name: $translate.instant('CONTACT_MAN.MANAGE_CONTACTS.TXT_GRID_NAME'),
                        field: 'getFullname()',
                        dynamic: false,
                        searchOn: 'firstName',
                        cellTemplate: '<div><a href="#" ng-click="grid.appScope.contacts.goToUpdate(row.entity);" ' +
                            'ng-bind="row.entity.getFullname()"></a></div>'
                    },
                    {
                        name: $translate.instant('CONTACT_MAN.MANAGE_CONTACTS.TXT_GRID_PHONE'),
                        field: 'getWorkPhone()',
                        searchOn: 'workPhone'
                    },
                    {
                        name: $translate.instant('CONTACT_MAN.MANAGE_CONTACTS.TXT_GRID_EMAIL'),
                        field: 'email',
                        searchOn: 'emailAddress'
                    },
                    {
                        name: $translate.instant('CONTACT.ID'),
                        field: 'id',
                        visible: false,
                        dynamic: false
                    },
                    {
                        name: $translate.instant('CONTACT_MAN.COMMON.TXT_FIRST_NAME'),
                        field:'firstName',
                        visible: false
                    },
                    {
                        name: $translate.instant('CONTACT_MAN.COMMON.TXT_LAST_NAME'),
                        field:'lastName',
                        visible: false
                    },
                    {
                        name: $translate.instant('ADDRESS_MAN.COMMON.TXT_ADDRESS_1'),
                        field:'address.addressLine1',
                        cellTemplate:'<div ng-bind="row.entity.address.addressLine1"></div>',
                        visible: false
                    },
                    {
                        name: $translate.instant('ADDRESS_MAN.COMMON.TXT_ADDRESS_2'),
                        field:'address.addressLine2',
                        cellTemplate:'<div ng-bind="row.entity.address.addressLine2"></div>',
                        visible: false
                    },
                    {
                        name: $translate.instant('ADDRESS.HOUSE_NUMBER'),
                        field:'',
                        visible: false
                    },
                    {
                        name: $translate.instant('ADDRESS.CITY'),
                        field:'address.city',
                        cellTemplate:'<div ng-bind="row.entity.address.city"></div>',
                        visible: false
                    },
                    {
                        name: $translate.instant('ADDRESS_MAN.COMMON.TXT_STATE'),
                        field:'address.state',
                        cellTemplate:'<div ng-bind="row.entity.address.state"></div>',
                        visible: false
                    },
                    {
                        name: $translate.instant('ADDRESS.PROVINCE'),
                        field:'address.province',
                        cellTemplate:'<div ng-bind="row.entity.address.province"></div>',
                        visible: false
                    },
                    {
                        name: $translate.instant('ADDRESS.COUNTY'),
                        field:'address.county',
                        cellTemplate:'<div ng-bind="row.entity.address.county"></div>',
                        visible: false
                    },
                    {
                        name: $translate.instant('ADDRESS.DISTRICT'),
                        field:'address.district',
                        cellTemplate:'<div ng-bind="row.entity.address.district"></div>',
                        visible: false
                    },
                    {
                        name: $translate.instant('ADDRESS.COUNTRY'),
                        field:'address.country',
                        cellTemplate:'<div ng-bind="row.entity.address.country"></div>',
                        visible: false
                    },
                    {
                        name: $translate.instant('ADDRESS.ZIP_POSTAL'),
                        field:'address.postalCode',
                        cellTemplate:'<div ng-bind="row.entity.address.postalCode"></div>',
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
