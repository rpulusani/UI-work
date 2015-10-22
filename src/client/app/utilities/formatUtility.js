define(['angular', 'utility','utility.blankCheckUtility'], function(angular) {
    'use strict';
    angular.module('mps.utility')
    .factory('Format', ['BlankCheck',
        function(BlankCheck) {
        var Format = function() {};

        Format.prototype.formatAddress = function(address){
            var formattedAddress = '';
            if (BlankCheck.checkNotNullOrUndefined(address) ) {
                if (BlankCheck.checkNotBlank(address.storeFrontName)){
                    formattedAddress = formattedAddress + address.storeFrontName + '\n';
                }
                if (BlankCheck.checkNotBlank(address.addressLine1)){
                    formattedAddress = formattedAddress + address.addressLine1 + '\n';
                }
                if (BlankCheck.checkNotBlank(address.city)){
                    formattedAddress = formattedAddress + address.city;
                    if (!BlankCheck.checkNotBlank(address.postalCode) && !BlankCheck.checkNotBlank(address.state)) {
                        formattedAddress = formattedAddress + '\n';
                    } else {
                        formattedAddress = formattedAddress + ', ';
                    }
                }
                if (BlankCheck.checkNotBlank(address.state)){
                    formattedAddress = formattedAddress + address.state;
                    if (!BlankCheck.checkNotBlank(address.postalCode)) {
                        formattedAddress = formattedAddress + '\n';
                    } else {
                        formattedAddress = formattedAddress + ' ';
                    }
                }
                if (BlankCheck.checkNotBlank(address.postalCode)){
                    formattedAddress = formattedAddress + address.postalCode + '\n';
                }
                if (BlankCheck.checkNotBlank(address.building)){
                    formattedAddress = formattedAddress + address.building;
                    if (!BlankCheck.checkNotBlank(address.floor) && !BlankCheck.checkNotBlank(address.office)) {
                        formattedAddress = formattedAddress + '\n';
                    } else {
                        formattedAddress = formattedAddress + ', ';
                    }
                }
                if (BlankCheck.checkNotBlank(address.floor)){
                    formattedAddress = formattedAddress + address.floor;
                if (!BlankCheck.checkNotBlank(address.office)) {
                        formattedAddress = formattedAddress + '\n';
                    } else {
                        formattedAddress = formattedAddress + ', ';
                    }
                }
                if (BlankCheck.checkNotBlank(address.office)){
                     formattedAddress = formattedAddress + address.office + '\n';
                }
                if (BlankCheck.checkNotBlank(address.country)){
                     formattedAddress = formattedAddress + address.country;
                }

            }
            return formattedAddress;
        };

        Format.prototype.formatContact = function(contact){
            var formattedContact = '';
            if (BlankCheck.checkNotNullOrUndefined(contact) ) {
                if (BlankCheck.checkNotBlank(contact.firstName)){
                    formattedContact = formattedContact + contact.firstName;
                    if (!BlankCheck.checkNotBlank(contact.lastName)) {
                        formattedContact = formattedContact + '\n';
                    } else {
                        formattedContact = formattedContact + ' ';
                    }
                }
                if (BlankCheck.checkNotBlank(contact.lastName)){
                    formattedContact = formattedContact + contact.lastName + '\n';
                }
                if (BlankCheck.checkNotBlank(contact.email)){
                    formattedContact = formattedContact + contact.email + '\n';
                }
                if (BlankCheck.checkNotBlank(contact.workPhone)){
                    formattedContact = formattedContact + contact.workPhone;
                }
            }
            return formattedContact;
        };

        return new Format();
    }]);
});
