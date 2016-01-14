define(['angular', 'utility'], function(angular) {
    'use strict';
    angular.module('mps.utility')
    .factory('FormatterService', [ '$translate', 'BlankCheck','$filter',
        function($translate, BlankCheck, $filter) {
            return{
                getFormattedSRNumber: function(serviceRequest){

                    if(serviceRequest && serviceRequest._links && serviceRequest.requestNumber &&
                        serviceRequest._links['ui'] && serviceRequest._links['ui'] !== ''){
                        return '<a href="' + serviceRequest._links['ui'] + '">' + serviceRequest.requestNumber + '</a>';
                    }else if(serviceRequest && serviceRequest.requestNumber){
                        return serviceRequest.requestNumber;
                    }else{
                        return '';
                    }
                },
                getFullName: function(firstName, lastName, middleName){
                    if(firstName !== undefined && firstName !== null && firstName !== '' &&
                        lastName !== undefined && lastName !== null && lastName !== ''){
                        var fullname = lastName + ', ' +  firstName;
                        if (middleName) {
                            fullname += ' ' + middleName;
                            return fullname;
                        } else {
                            return fullname;
                        }
                    }else if((firstName !== undefined || firstName !== null || firstName === '') &&
                        lastName !== undefined && lastName !== null && lastName !== ''){
                        return lastName;
                    }else if(firstName !== undefined && firstName !== null && firstName !== '' &&
                        (lastName !== undefined || lastName !== null  || lastName === '')){
                        return firstName;
                    }else{
                        return '';
                    }
                },
                getPhoneFormat: function(telephone){
                    if (!telephone) { return ''; }
                    var value = telephone.toString().trim().replace(/^\+/, '');

                    if (value.match(/[^0-9]/)) {
                            return telephone;
                    }

                    var country, city, number;
                    switch (value.length) {
                        case 10: // +1PPP####### -> C (PPP) ###-####
                            country = 1;
                            city = value.slice(0, 3);
                            number = value.slice(3);
                            break;

                        case 11: // +CPPP####### -> CCC (PP) ###-####
                            country = value[0];
                            city = value.slice(1, 4);
                            number = value.slice(4);
                            break;

                        case 12: // +CCCPP####### -> CCC (PP) ###-####
                            country = value.slice(0, 3);
                            city = value.slice(3, 5);
                            number = value.slice(5);
                            break;

                        default:
                            return telephone;
                    }
                    number = number.slice(0, 3) + '-' + number.slice(3);

                    return (country + " (" + city + ") " + number).trim();

                },
                formatAddress: function(address){
                    var formattedAddress = '';
                    if (BlankCheck.checkNotNullOrUndefined(address) ) {
                        if (BlankCheck.checkNotBlank(address.storeFrontName)){
                            formattedAddress += address.storeFrontName + '<br/>';
                        }
                        if (BlankCheck.checkNotBlank(address.addressLine1)){
                            formattedAddress += address.addressLine1 + '<br/>';
                        }
                        if (BlankCheck.checkNotBlank(address.addressLine2)){
                            formattedAddress += address.addressLine2 + '<br/>';
                        }
                        if (BlankCheck.checkNotBlank(address.city)){
                            formattedAddress = formattedAddress + address.city;
                            if (!BlankCheck.checkNotBlank(address.postalCode) && !BlankCheck.checkNotBlank(address.state)) {
                                formattedAddress = formattedAddress + '<br/>';
                            } else {
                                formattedAddress = formattedAddress + ', ';
                            }
                        }
                        if (BlankCheck.checkNotBlank(address.state)){
                            formattedAddress = formattedAddress + address.state;
                            if (!BlankCheck.checkNotBlank(address.postalCode)) {
                                formattedAddress = formattedAddress + '<br/>';
                            } else {
                                formattedAddress = formattedAddress + ' ';
                            }
                        }
                        if (BlankCheck.checkNotBlank(address.postalCode)){
                            formattedAddress = formattedAddress + address.postalCode + '<br/>';
                        }
                        if (BlankCheck.checkNotBlank(address.building)){
                            formattedAddress = formattedAddress + address.building;
                            if (!BlankCheck.checkNotBlank(address.floor) && !BlankCheck.checkNotBlank(address.office)) {
                                formattedAddress = formattedAddress + '<br/>';
                            } else {
                                formattedAddress = formattedAddress + ', ';
                            }
                        }
                        if (BlankCheck.checkNotBlank(address.floor)){
                            formattedAddress = formattedAddress + address.floor;
                        if (!BlankCheck.checkNotBlank(address.office)) {
                                formattedAddress = formattedAddress + '<br/>';
                            } else {
                                formattedAddress = formattedAddress + ', ';
                            }
                        }
                        if (BlankCheck.checkNotBlank(address.office)){
                             formattedAddress = formattedAddress + address.office + '<br/>';
                        }
                        if (BlankCheck.checkNotBlank(address.country)){
                             formattedAddress = formattedAddress + address.country + '<br/>';
                        }

                    }
                    return formattedAddress;
                },
                formatDate: function(dateToBeFormatted){
                    var d = new Date(dateToBeFormatted);
                    return $filter('date')(d, 'MM/dd/yyyy');
                },
                formatDateForPost: function(dateToBeFormatted){
                    var d = new Date(dateToBeFormatted);
                    return $filter('date')(d, 'yyyy-MM-ddTHH:mm:ss');
                },
                formatAddresswoPhysicalLocation: function(address){
                    var formattedAddress = '';
                    if (BlankCheck.checkNotNullOrUndefined(address) ) {
                        if (BlankCheck.checkNotBlank(address.storeFrontName)){
                            formattedAddress += address.storeFrontName + '<br/>';
                        }
                        if (BlankCheck.checkNotBlank(address.addressLine1)){
                            formattedAddress += address.addressLine1 + '<br/>';
                        }
                        if (BlankCheck.checkNotBlank(address.addressLine2)){
                            formattedAddress += address.addressLine2 + '<br/>';
                        }
                        if (BlankCheck.checkNotBlank(address.city)){
                            formattedAddress = formattedAddress + address.city;
                            if (!BlankCheck.checkNotBlank(address.postalCode) && !BlankCheck.checkNotBlank(address.state)) {
                                formattedAddress = formattedAddress + '<br/>';
                            } else {
                                formattedAddress = formattedAddress + ', ';
                            }
                        }
                        if (BlankCheck.checkNotBlank(address.state)){
                            formattedAddress = formattedAddress + address.state;
                            if (!BlankCheck.checkNotBlank(address.postalCode)) {
                                formattedAddress = formattedAddress + '<br/>';
                            } else {
                                formattedAddress = formattedAddress + ' ';
                            }
                        }
                        if (BlankCheck.checkNotBlank(address.postalCode)){
                            formattedAddress = formattedAddress + address.postalCode + '<br/>';
                        }
                        if (BlankCheck.checkNotBlank(address.country)){
                             formattedAddress = formattedAddress + address.country + '<br/>';
                        }

                    }
                    return formattedAddress;
                },
                formatAddressSingleLine: function(address){
                    var formattedAddress = '';
                    if (BlankCheck.checkNotNullOrUndefined(address) ) {
                        if (BlankCheck.checkNotBlank(address.addressLine1)){
                            formattedAddress += address.addressLine1 + ' ';
                        }
                        if (BlankCheck.checkNotBlank(address.addressLine2)){
                            formattedAddress += address.addressLine2 + ' ';
                        }
                        if (BlankCheck.checkNotBlank(address.city)){
                            formattedAddress = formattedAddress + address.city;
                            if (BlankCheck.checkNotBlank(address.postalCode) 
                                || BlankCheck.checkNotBlank(address.state)
                                || BlankCheck.checkNotBlank(address.country)) {
                                formattedAddress = formattedAddress + ', ';
                            }
                        }
                        if (BlankCheck.checkNotBlank(address.state)){
                            formattedAddress = formattedAddress + address.state;
                            if (BlankCheck.checkNotBlank(address.postalCode) || BlankCheck.checkNotBlank(address.country)) {
                                formattedAddress = formattedAddress + ' ';
                            }
                        }
                        if (BlankCheck.checkNotBlank(address.postalCode)){
                            formattedAddress = formattedAddress + address.postalCode;
                            if (BlankCheck.checkNotBlank(address.country)) {
                                formattedAddress = formattedAddress + ' ';
                            }
                        }
                        if (BlankCheck.checkNotBlank(address.country)){
                             formattedAddress = formattedAddress + address.country;
                        }

                    }
                    return formattedAddress;
                },
                formatContact: function(contact){
                    var formattedContact = '';
                    if (BlankCheck.checkNotNullOrUndefined(contact)) {
                        formattedContact = this.getFullName(contact.firstName, contact.lastName, contact.middleName);
                        if (BlankCheck.checkNotBlank(contact.email)) {
                            formattedContact += '<br/>' + contact.email;
                        }
                         if (BlankCheck.checkNotBlank(contact.workPhone)) {
                            formattedContact += '<br/>' + this.getPhoneFormat(contact.workPhone);
                        }
                    }
                    return formattedContact;
                },
                formatYesNo: function(value) {
                    return (value === 'true') ? $translate.instant('LABEL.YES') : $translate.instant('LABEL.NO');
                },
                formatNoneIfEmpty: function(value) {
                    return (BlankCheck.isNullOrWhiteSpace(value) === true) ? $translate.instant('LABEL.NONE') : value;
                },
                getAmountWithCurrency: function(amount, currency){
                    return amount + ' (' + currency + ')';
                },
                getFileSize: function(fileSize) {
                    return Math.abs(fileSize/1024).toFixed(0) + 'KB';
                }
            };

    }]);
});
