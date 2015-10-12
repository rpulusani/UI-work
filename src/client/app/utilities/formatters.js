define(['angular', 'utility'], function(angular) {
    'use strict';
    angular.module('mps.utility')
    .factory('FormatterService', [ '$translate',
        function($translate) {
            return{
                getFullName: function(firstName, lastName, middleName){
                    var fullname = lastName + ', ' +  firstName;
                    if (middleName) {
                        fullname += ' ' + middleName;
                        return fullname;
                    } else {
                        return fullname;
                    }
                },
                getPhoneFormat: function(telephone){
                    if (!telephone) { return ''; }
                    var value = telephone.toString().trim().replace(/^\+/, '');

                    if (value.match(/[^0-9]/)) {
                            return tel;
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

                }
            };
    }]);
});
