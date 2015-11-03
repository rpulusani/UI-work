define(['angular', 'angular-mocks', 'utility.formatters'], function(angular, mocks, FormatterService) {
    describe('Formatters Utility Module', function() {
        var formatter;
        beforeEach(module('mps'));
        beforeEach(inject(['FormatterService', function(Formatter){
                formatter = Formatter;
        }]));
        describe('getFormattedSRNumber', function(){
            it('should format to a link', function(){
                var expected = '<a href=\"http://www.google.com/1-23-456-789-00\">1-23-456-789-00</a>';
                var serviceRequest = {
                    'id': '1-23-456-789-00',
                    '_links':{
                        'ui': 'http://www.google.com/1-23-456-789-00'
                    }
                };
                var actual = formatter.getFormattedSRNumber(serviceRequest);
                expect(actual).toEqual(expected);
            });
            it('should show just id because of empty ui link', function(){
                var expected = '1-23-456-789-00';
                var serviceRequest = {
                    'id': '1-23-456-789-00',
                    '_links':{
                        'ui': ''
                    }
                };
                var actual = formatter.getFormattedSRNumber(serviceRequest);
                expect(actual).toEqual(expected);
            });
            it('should show just id because of missing ui link', function(){
                var expected = '1-23-456-789-00';
                var serviceRequest = {
                    'id': '1-23-456-789-00',
                    '_links':{}
                };
                var actual = formatter.getFormattedSRNumber(serviceRequest);
                expect(actual).toEqual(expected);
            });
            it('should show just id because of missing _link section', function(){
                var expected = '1-23-456-789-00';
                var serviceRequest = {
                    'id': '1-23-456-789-00'
                };
                var actual = formatter.getFormattedSRNumber(serviceRequest);
                expect(actual).toEqual(expected);
            });
             it('should show just empty string because of empty id', function(){
                var expected = '';
                var serviceRequest = {
                    'id': ''
                };
                var actual = formatter.getFormattedSRNumber(serviceRequest);
                expect(actual).toEqual(expected);
            });
            it('should show just empty string because of missing id', function(){
                var expected = '';
                var serviceRequest = {};
                var actual = formatter.getFormattedSRNumber(serviceRequest);
                expect(actual).toEqual(expected);
            });
            it('should show just empty string because of null serviceRequest', function(){
                var expected = '';
                var serviceRequest = null;
                var actual = formatter.getFormattedSRNumber(serviceRequest);
                expect(actual).toEqual(expected);
            });
            it('should show just empty string because of undefined serviceRequest', function(){
                var expected = '';
                var serviceRequest = undefined;
                var actual = formatter.getFormattedSRNumber(serviceRequest);
                expect(actual).toEqual(expected);
            });
        });
        describe('getFullName', function(){
            it('should get full name if all fields are filled',function(){
                var first = 'joe',
                    middle = 'buck',
                    last = 'doe',
                    expected = 'doe, joe buck';
                var actual = formatter.getFullName(first,last,middle);
                expect(expected).toEqual(actual);

            });
            it('should get first and last name if middle is empty',function(){
                var first = 'joe',
                    middle = '',
                    last = 'doe',
                    expected = 'doe, joe';
                var actual = formatter.getFullName(first,last,middle);
                expect(expected).toEqual(actual);

            });
             it('should get first and last name if middle is null',function(){
                var first = 'joe',
                    middle = null,
                    last = 'doe',
                    expected = 'doe, joe';
                var actual = formatter.getFullName(first,last,middle);
                expect(expected).toEqual(actual);

            });
             it('should get first and last name if middle is undefined',function(){
                var first = 'joe',
                    middle = undefined,
                    last = 'doe',
                    expected = 'doe, joe';
                var actual = formatter.getFullName(first,last,middle);
                expect(expected).toEqual(actual);

            });
             it('should get last name if middle is undefined and first name is empty',function(){
                var first = '',
                    middle = undefined,
                    last = 'doe',
                    expected = 'doe';
                var actual = formatter.getFullName(first,last,middle);
                expect(expected).toEqual(actual);

            });
             it('should get last name if middle is undefined and first name is null',function(){
                var first = null,
                    middle = undefined,
                    last = 'doe',
                    expected = 'doe';
                var actual = formatter.getFullName(first,last,middle);
                expect(expected).toEqual(actual);

            });
             it('should get last name if middle is undefined and first name is undefined',function(){
                var first = undefined,
                    middle = undefined,
                    last = 'doe',
                    expected = 'doe';
                var actual = formatter.getFullName(first,last,middle);
                expect(expected).toEqual(actual);


             });
               it('should get first name if middle is undefined and last name is empty',function(){
                var last = '',
                    middle = undefined,
                    first = 'doe',
                    expected = 'doe';
                var actual = formatter.getFullName(first,last,middle);
                expect(expected).toEqual(actual);

            });
             it('should get first name if middle is undefined and last name is null',function(){
                var last = null,
                    middle = undefined,
                    first = 'doe',
                    expected = 'doe';
                var actual = formatter.getFullName(first,last,middle);
                expect(expected).toEqual(actual);

            });
             it('should get first name if middle is undefined and last name is undefined',function(){
                var last = undefined,
                    middle = undefined,
                    first = 'doe',
                    expected = 'doe';
                var actual = formatter.getFullName(first,last,middle);
                expect(expected).toEqual(actual);

            });
             it('should get empty string if middle is undefined and last name is undefined and first name is undefined',function(){
                var last = undefined,
                    middle = undefined,
                    first = undefined,
                    expected = '';
                var actual = formatter.getFullName(first,last,middle);
                expect(expected).toEqual(actual);

            });
             it('should get empty string if middle is null and last name is null and first name is null',function(){
                var last = null,
                    middle = null,
                    first = null,
                    expected = '';
                var actual = formatter.getFullName(first,last,middle);
                expect(expected).toEqual(actual);
            });
              it('should get empty string if middle is empty and last name is empty and first name is empty',function(){
                var last = '',
                    middle = '',
                    first = '',
                    expected = '';
                var actual = formatter.getFullName(first,last,middle);
                expect(expected).toEqual(actual);
            });
        });
        describe('getPhoneFormat', function(){
            it('should return back the same value if there is alpha characters in the phone number', function(){
                var phone = 'a1231b123';
                var expected = 'a1231b123';
                var actual = formatter.getPhoneFormat(phone);
                expect(actual).toEqual(expected);
            });
            it('should return empty if there the phone is null', function(){
                var phone = null;
                var expected = '';
                var actual = formatter.getPhoneFormat(phone);
                expect(actual).toEqual(expected);
            });
             it('should return empty if there the phone is undefined', function(){
                var phone = undefined;
                var expected = '';
                var actual = formatter.getPhoneFormat(phone);
                expect(actual).toEqual(expected);
            });
              it('should return 10 digit format if there the phone is has 10 digits', function(){
                var phone = 1234567890;
                var expected = '1 (123) 456-7890';
                var actual = formatter.getPhoneFormat(phone);
                expect(actual).toEqual(expected);
            });
               it('should return 11 digit format if there the phone is has 11 digits', function(){
                var phone = 12345678902;
                var expected = '1 (234) 567-8902';
                var actual = formatter.getPhoneFormat(phone);
                expect(actual).toEqual(expected);
            });
            it('should return 12 digit format if there the phone is has 12 digits', function(){
                var phone = 123456789023;
                var expected = '123 (45) 678-9023';
                var actual = formatter.getPhoneFormat(phone);
                expect(actual).toEqual(expected);
            });
            it('should return itself if there the phone is has 13+ digits', function(){
                var phone = 1234567890234;
                var expected = 1234567890234;
                var actual = formatter.getPhoneFormat(phone);
                expect(actual).toEqual(expected);
            });
        });
        describe('formatAddress', function(){
            it('should be full formatted if store front, address line 1, address line 2, city, state, postalCode, ' +
                'building, floor, office and country are included',
                function(){
                    var address = {
                        storeFrontName: 'Test',
                        addressLine1: '123 Vivion Rd',
                        addressLine2: 'Suite 12A',
                        city: 'Kansas City',
                        state: 'MO',
                        postalCode: '64102',
                        building: '3',
                        floor: '12',
                        office: '8H',
                        country: 'USA'
                    },
                    expected = 'Test<br/>123 Vivion Rd<br/>Suite 12A<br/>Kansas City, MO 64102<br/>3, 12, 8H<br/>USA<br/>';
                    var actual = formatter.formatAddress(address);
                    expect(actual).toEqual(expected);
            });
            it('should be full formatted if store front, address line 1, address line 2, city, state, postalCode, ' +
                'building, floor, office and country(not included) are included',
                function(){
                    var address = {
                        storeFrontName: 'Test',
                        addressLine1: '123 Vivion Rd',
                        addressLine2: 'Suite 12A',
                        city: 'Kansas City',
                        state: 'MO',
                        postalCode: '64102',
                        building: '3',
                        floor: '12',
                        office: '8H',
                        country: ''
                    },
                    expected = 'Test<br/>123 Vivion Rd<br/>Suite 12A<br/>Kansas City, MO 64102<br/>3, 12, 8H<br/>';
                    var actual = formatter.formatAddress(address);
                    expect(actual).toEqual(expected);
            });
            it('should be full formatted if store front, address line 1, address line 2, city, state, postalCode, ' +
                'building, floor, office(not included) and country(not included) are included',
                function(){
                    var address = {
                        storeFrontName: 'Test',
                        addressLine1: '123 Vivion Rd',
                        addressLine2: 'Suite 12A',
                        city: 'Kansas City',
                        state: 'MO',
                        postalCode: '64102',
                        building: '3',
                        floor: '12',
                        office: '',
                        country: ''
                    },
                    expected = 'Test<br/>123 Vivion Rd<br/>Suite 12A<br/>Kansas City, MO 64102<br/>3, 12<br/>';
                    var actual = formatter.formatAddress(address);
                    expect(actual).toEqual(expected);
            });
            it('should be full formatted if store front, address line 1, address line 2(not included), city, state, postalCode, ' +
                'building, floor, office and country(not included) are included',
                function(){
                    var address = {
                        storeFrontName: 'Test',
                        addressLine1: '123 Vivion Rd',
                        addressLine2: '',
                        city: 'Kansas City',
                        state: 'MO',
                        postalCode: '64102',
                        building: '3',
                        floor: '12',
                        office: '8H',
                        country: ''
                    },
                    expected = 'Test<br/>123 Vivion Rd<br/>Kansas City, MO 64102<br/>3, 12, 8H<br/>';
                    var actual = formatter.formatAddress(address);
                    expect(actual).toEqual(expected);
            });
             it('should be full formatted if store front, address line 1, address line 2(not included), city,' +
                'state (not included), postalCode, building, floor, office and country(not included) are included',
                function(){
                    var address = {
                        storeFrontName: 'Test',
                        addressLine1: '123 Vivion Rd',
                        addressLine2: '',
                        city: 'Kansas City',
                        state: '',
                        postalCode: '64102',
                        building: '3',
                        floor: '12',
                        office: '8H',
                        country: ''
                    },
                    expected = 'Test<br/>123 Vivion Rd<br/>Kansas City, 64102<br/>3, 12, 8H<br/>';
                    var actual = formatter.formatAddress(address);
                    expect(actual).toEqual(expected);
            });
               it('should be full formatted if store front, address line 1, address line 2(not included), city,' +
                'state (not included), postalCode, (not included) building, floor, office and' +
                ' country(not included) are included',
                function(){
                    var address = {
                        storeFrontName: 'Test',
                        addressLine1: '123 Vivion Rd',
                        addressLine2: '',
                        city: 'Kansas City',
                        state: '',
                        postalCode: '',
                        building: '3',
                        floor: '12',
                        office: '8H',
                        country: ''
                    },
                    expected = 'Test<br/>123 Vivion Rd<br/>Kansas City<br/>3, 12, 8H<br/>';
                    var actual = formatter.formatAddress(address);
                    expect(actual).toEqual(expected);
            });
                it('should be full formatted if store front (not included), address line 1, address line 2(not included), city,' +
                'state (not included), postalCode (not included), building, floor, office and' +
                ' country(not included) are included',
                function(){
                    var address = {
                        storeFrontName: '',
                        addressLine1: '123 Vivion Rd',
                        addressLine2: '',
                        city: 'Kansas City',
                        state: '',
                        postalCode: '',
                        building: '3',
                        floor: '12',
                        office: '8H',
                        country: ''
                    },
                    expected = '123 Vivion Rd<br/>Kansas City<br/>3, 12, 8H<br/>';
                    var actual = formatter.formatAddress(address);
                    expect(actual).toEqual(expected);
            });
                 it('should be full formatted if store front (not included), address line 1, address line 2(not included), city,' +
                'state (not included), postalCode (not included), building(not included), floor, office(not included) and' +
                ' country(not included) are included',
                function(){
                    var address = {
                        storeFrontName: '',
                        addressLine1: '123 Vivion Rd',
                        addressLine2: '',
                        city: 'Kansas City',
                        state: '',
                        postalCode: '',
                        building: '',
                        floor: '12',
                        office: '',
                        country: ''
                    },
                    expected = '123 Vivion Rd<br/>Kansas City<br/>12<br/>';
                    var actual = formatter.formatAddress(address);
                    expect(actual).toEqual(expected);
            });
            it('should be address line 1  and city', function(){
                    var address = {
                        storeFrontName: '',
                        addressLine1: '123 Vivion Rd',
                        addressLine2: '',
                        city: 'Kansas City',
                        state: '',
                        postalCode: '',
                        building: '',
                        floor: '',
                        office: '',
                        country: ''
                    },
                    expected = '123 Vivion Rd<br/>Kansas City<br/>';
                    var actual = formatter.formatAddress(address);
                    expect(actual).toEqual(expected);
            });
            it('should be address line 1 ', function(){
                    var address = {
                        storeFrontName: '',
                        addressLine1: '123 Vivion Rd',
                        addressLine2: '',
                        city: '',
                        state: '',
                        postalCode: '',
                        building: '',
                        floor: '',
                        office: '',
                        country: ''
                    },
                    expected = '123 Vivion Rd<br/>';
                    var actual = formatter.formatAddress(address);
                    expect(actual).toEqual(expected);
            });
        });
        describe('formatContact', function(){
            it('should output a fully formatted', function(){
                var contact = {
                    firstName: 'joe',
                    middleName: 'buck',
                    lastName: 'moose',
                    email: 'timber@north.ca',
                    workPhone: '1234567890'
                },
                expected = 'moose, joe buck<br/>timber@north.ca<br/>1 (123) 456-7890';

                var actual = formatter.formatContact(contact);

                expect(actual).toEqual(expected);

            });
              it('should output a formatted contact info without workPhone', function(){
                var contact = {
                    firstName: 'joe',
                    middleName: 'buck',
                    lastName: 'moose',
                    email: 'timber@north.ca',
                    workPhone: ''
                },
                expected = 'moose, joe buck<br/>timber@north.ca';

                var actual = formatter.formatContact(contact);

                expect(actual).toEqual(expected);

            });
              it('should output a formatted contact info without workPhone and middle name', function(){
                var contact = {
                    firstName: 'joe',
                    middleName: '',
                    lastName: 'moose',
                    email: 'timber@north.ca',
                    workPhone: ''
                },
                expected = 'moose, joe<br/>timber@north.ca';

                var actual = formatter.formatContact(contact);

                expect(actual).toEqual(expected);

            });
              it('should output a formatted contact info without workPhone, middle name and lastName', function(){
                var contact = {
                    firstName: 'joe',
                    middleName: '',
                    lastName: '',
                    email: 'timber@north.ca',
                    workPhone: ''
                },
                expected = 'joe<br/>timber@north.ca';

                var actual = formatter.formatContact(contact);

                expect(actual).toEqual(expected);

            });
               it('should output a formatted contact info without workPhone, first name, middle name and lastName', function(){
                var contact = {
                    firstName: '',
                    middleName: '',
                    lastName: '',
                    email: 'timber@north.ca',
                    workPhone: ''
                },
                expected = '<br/>timber@north.ca';

                var actual = formatter.formatContact(contact);

                expect(actual).toEqual(expected);

            });

        });
    });
});
