

angular.module('mps.utility')
.factory('FormatterService', [ '$translate', 'BlankCheck','$filter',
    function($translate, BlankCheck, $filter) {
        return{
            formatPercentage: function(incommingValue){
                var percentage;
                if(incommingValue !== '-' && typeof incommingValue === "number"){
                    if(incommingValue % 1 === 0){
                        percentage = incommingValue + '%';
                    }else{
                        percentage = $filter('number')(incommingValue * 100, 2) + '%';
                    }
                }else if(incommingValue !== '-' && typeof incommingValue === "string"){
                    var floatValue = parseFloat(incommingValue);
                    if(floatValue % 1 !== 0){
                        percentage = $filter('number')(incommingValue * 100, 2) + '%';
                    }else{
                         percentage = floatValue + '%';
                    }
                }else{
                    percentage = '-';
                }
                return percentage;
            },
            formatCurrency: function(incommingMoney){
                var moneyValue = 0.0,
                price;
                if(incommingMoney !== '-' && typeof incommingMoney === "number"){
                    moneyValue = $filter('currency')(incommingMoney, 'USD$');
                }else if(incommingMoney !== '-' && typeof incommingMoney === "string"){
                    var money = parseFloat(incommingMoney);
                    if( money === 0){
                        moneyValue = '-';
                    }else{
                        moneyValue = $filter('currency')(money, 'USD$');
                    }
                }else{
                    moneyValue = '-';
                }

                return moneyValue;
            },
            itemSubTotal: function(incommingPrice, incommingQty){
                 var price = 0.0,
                            qty = 0.0,
                            subtotal;


                            if(incommingPrice !== '-' && typeof incommingPrice === "number"){
                                price = incommingPrice;
                            }else if(this.price !== '-' && typeof incommingPrice === "string"){
                                price = parseFloat(incommingPrice);
                            }else{
                                price = 0.0;
                            }
                            if(incommingQty !== '-' && typeof incommingQty === "number"){
                                qty = incommingQty;
                            }else if(incommingQty !== '-' && typeof incommingQty === "string"){
                                qty = parseInt(incommingQty, 10);
                            }else{
                                qty = 0.0;
                            }

                            if(incommingPrice === '-'){
                                subtotal = 0.0;
                            }else if(price === 0.0 && incommingPrice !== '-'){
                                subtotal = 0.0;
                            }else if(price > 0.0 && qty > 0){
                                subtotal = price * qty;
                            }else if(qty === 0){
                                subtotal = 0.0;
                            }else {
                                subtotal = 0.0;
                            }
                            return subtotal;
            },
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
            addBuildingFloorOffice: function(physicalLocationAddress){
            	/** This adds the building floor office or physicallocation1 physicallocation2 physicallocation3 to 
            	 * the formatted address*/
            	var formattedAddress = '';
            	 if (BlankCheck.checkNotBlank(physicalLocationAddress.physicalLocation1)){
                     formattedAddress = formattedAddress + physicalLocationAddress.physicalLocation1 + '<br/>';
                 }
            	 if (BlankCheck.checkNotBlank(physicalLocationAddress.physicalLocation2)){
                     formattedAddress = formattedAddress + physicalLocationAddress.physicalLocation2 + '<br/>';
                 }
            	 if (BlankCheck.checkNotBlank(physicalLocationAddress.physicalLocation3)){
                     formattedAddress = formattedAddress + physicalLocationAddress.physicalLocation3 + '<br/>';
                 }
            	return formattedAddress;
            },
            convertUTCDateToLocalDate: function(d) {
                if (d === undefined || d === null) { return; }
                var newDate = new Date(d.getTime()+d.getTimezoneOffset()*60*1000);

                return newDate;
            },
            getDisplayDate: function(d) {
                var dy = this.convertUTCDateToLocalDate(d);
                return $filter('date')(dy, 'MM/dd/yyyy');
            },
            getDatePickerDisplayDate: function(d) {
                var dy = this.convertUTCDateToLocalDate(d);
                return $filter('date')(dy, 'yyyy-MM-dd');
            },
            getPostDateUtcZero: function(d) {
                return $filter('date')(d, 'yyyy-MM-ddT00:00:00');
            },
            formatDate: function(dateToBeFormatted){
                if (dateToBeFormatted === undefined || dateToBeFormatted === null) {
                    return '';
                }
                var d = new Date(dateToBeFormatted.replace(/\s/, 'T')+'Z');
                return $filter('date')(d, 'MM/dd/yyyy');
            },
            formatLocalDate: function(dateToBeFormatted){
                if (dateToBeFormatted === undefined || dateToBeFormatted === null) {
                    return '';
                }
                var localDate = new Date(dateToBeFormatted.replace(/\s/, 'T'));
                var d = new Date(localDate.getTime() + localDate.getTimezoneOffset()*60*1000);
                return $filter('date')(d, 'MM/dd/yyyy');
            },
            formatDateForPost: function(dateToBeFormatted){
                    if (dateToBeFormatted === undefined || dateToBeFormatted === null) {
                        return '';
                    }
                    var localDate = new Date(dateToBeFormatted.replace(/\s/, 'T'));
                    var d = new Date(localDate.getTime() + localDate.getTimezoneOffset()*60*1000);
                return $filter('date')(d, 'yyyy-MM-ddTHH:mm:ss');
            },
            formatLocalDateForPost: function(dateToBeFormatted){
                    if (dateToBeFormatted === undefined || dateToBeFormatted === null) {
                        return '';
                    }
                    var localDate = new Date(dateToBeFormatted);
                    var d = new Date(localDate.getTime() + localDate.getTimezoneOffset()*60*1000);
                return $filter('date')(d, 'yyyy-MM-ddTHH:mm:ss');
            },
            formatDateForAdmin: function(dateToBeFormatted){
                    if (dateToBeFormatted === undefined || dateToBeFormatted === null) {
                        return '';
                    }
                var d = new Date(dateToBeFormatted);
                return $filter('date')(d, 'yyyy-MM-dd');
            },
            formatDateForRome: function(dateToBeFormatted){
	                if (dateToBeFormatted === undefined || dateToBeFormatted === null) {
	                    return '';
	                }                    
	            var d = new Date(dateToBeFormatted);
	            return $filter('date')(d, 'yyyy-MM-dd');
            },
            addTimeToDate:function(dateToBeFormatted,hour,min){
                 if (dateToBeFormatted === undefined || dateToBeFormatted === null) {
                        return '';
                }
                var localDate = new Date(dateToBeFormatted.replace(/\s/, 'T'));
                var d = new Date(localDate.getTime() + localDate.getTimezoneOffset()*60*1000);
				if (hour !== undefined && hour !== null && min !== undefined && min !== null){
					d.setHours(hour,min);
				}                    
                return $filter('date')(d, 'yyyy-MM-ddTHH:mm:ss');
            },
            getDateFromString: function(dateToBeFormatted){
                 if (dateToBeFormatted === undefined || dateToBeFormatted === null) {
                    return '';
                }
                return new Date(dateToBeFormatted.replace(/\s/, 'T')+'Z');
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
            formatStatus: function(value) {
                return (value === true) ? $translate.instant('LABEL.COMMON.ACTIVE') : $translate.instant('LABEL.COMMON.INACTIVE');
            },
            formatYesNo: function(value) {
                return (value === true || value === 'true') ? $translate.instant('LABEL.COMMON.YES') : $translate.instant('LABEL.COMMON.NO');
            },
            formatNoneIfEmpty: function(value) {
                return (BlankCheck.isNullOrWhiteSpace(value) === true) ? $translate.instant('LABEL.COMMON.NONE') : value;
            },
            getAmountWithCurrency: function(amount, currency){
                return amount + ' (' + currency + ')';
            },
            getFileSize: function(fileSize) {
                return Math.abs(fileSize/1024).toFixed(0) + 'KB';
            },
            getFileOwnerForLibrary: function(owner, currentUser) {
                var strYou = $translate.instant('DOCUMENT_LIBRARY.DOCUMENT_VIEW.TXT_YOU');

                if (owner === currentUser) {
                    return '<strong><i>' + owner + ' (' + strYou + ')</i></strong>';
                }
                else {
                    return owner;
                }
            }
        };
}]);
