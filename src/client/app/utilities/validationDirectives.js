angular.module('mps.utility')
.directive('emailValid',function(){
    return {
        require: 'ngModel',
        link: function(scope, element, attr, emailCtrl) {
            scope.$watch(attr.ngModel, function(value) {
                emailValidation(value);
            });
            function emailValidation(value) {
                var emailExpression = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
                var validEmail = emailExpression.test(value);
                if (validEmail) {
                    emailCtrl.$setValidity('emailId', true);
                } else {
                    emailCtrl.$setValidity('emailId', false);
                }
                return value;
            }
            emailCtrl.$parsers.push(emailValidation);
        }
    };
})
.directive('phoneValid',function(){
    return {
        require: 'ngModel',
        link: function(scope, element, attr, phoneCtrl) {
            function phoneValidation(value) {
                var phoneExpression = /^[+]{0,1}(\d){1,3}[ ]?([-]?((\d)|[ ]){1,12})+$/;
                var validPhone = phoneExpression.test(value);
                if (validPhone) {
                    phoneCtrl.$setValidity('phoneNumber', true);
                } else {
                    phoneCtrl.$setValidity('phoneNumber', false);
                }
                return value;
            }
            phoneCtrl.$parsers.push(phoneValidation);
        }
    };
})
.directive('postalCodeValid',function(){
    return {
        require: 'ngModel',
        link: function(scope, element, attr, zipCtrl) {
            function zipValidation(value) {
                var zipExpression = /^[a-zA-Z0-9\s]{1,5}[-]?[a-zA-Z0-9]{1,5}?$/;
                var validZip = zipExpression.test(value);
                if (validZip) {
                    zipCtrl.$setValidity('zipCode', true);
                } else {
                    zipCtrl.$setValidity('zipCode', false);
                }
                return value;
            }
            zipCtrl.$parsers.push(zipValidation);
        }
    };
})
.directive('cityValid',function(){
    return {
        require: 'ngModel',
        link: function(scope, element, attr, cityCtrl) {
            function cityValidation(value) {
                var cityExpression = /^[a-zA-ZÀ-ÿ0-9\s]{1,50}$/;
                var validCity = cityExpression.test(value);
                if (validCity) {
                    cityCtrl.$setValidity('cityCode', true);
                } else {
                    cityCtrl.$setValidity('cityCode', false);
                }
                return value;
            }
            cityCtrl.$parsers.push(cityValidation);
        }
    };
})
.directive('ipAddressValid',function(){
    return {
        require: 'ngModel',
        link: function(scope, element, attr, ipCtrl) {
            function ipValidation(value) {
                var ipExpression = /^([0-9]{1,20}.){3}([0-9]{1,20}){1}$/;
                var validIP = ipExpression.test(value);
                if (validIP) {
                    ipCtrl.$setValidity('ipCode', true);
                } else {
                    ipCtrl.$setValidity('ipCode', false);
                }
                return value;
            }
            ipCtrl.$parsers.push(ipValidation);
        }
    };
})
.directive('nullCheck',function(){
    return {
        require: 'ngModel',
        link: function(scope, element, attr, nullCtrl) {
            scope.$watch(attr.ngModel, function(value) {
                nullValidation(value);
            });
            function nullValidation(value) {
                if (value === null || value.indexOf("null") != -1) {
                    nullCtrl.$setValidity('nullValid', false);
                } else {
                    nullCtrl.$setValidity('nullValid', true);
                }
                return value;
            }
            nullCtrl.$parsers.push(nullValidation);
        }
    };
})
.directive('nonZero',function(){
    return {
        require: 'ngModel',
        link: function(scope, element, attr, nonZeroCtrl) {
            scope.$watch(attr.ngModel, function(value) {
                nonZeroValidation(value);
            });
            function nonZeroValidation(value) {
                if (value === 0) {
                    nonZeroCtrl.$setValidity('nonZeroValid', false);
                } else {
                    nonZeroCtrl.$setValidity('nonZeroValid', true);
                }
                return value;
            }
            nonZeroCtrl.$parsers.push(nonZeroValidation);
        }
    };
})
.directive('validFile',function(){
    return {
        require:'ngModel',
        link:function(scope,element,attr,validFileCtrl){
            validFileCtrl.$setValidity('validFile', element.val() != '');
            element.bind('change',function(){
                validFileCtrl.$setValidity('validFile', element.val() != '');
                scope.$apply(function(){
                    validFileCtrl.$setViewValue(element.val());
                    validFileCtrl.$render();
                });
            });
        }
    }
})
.directive('checkFormValid',function(){
    return{        
        require: '^form',
        restrict: 'A',
        link: function(scope, elem, attrs, ctrl){
            elem.on('submit', function () {
                if(!ctrl.$valid){
                    var $ = require('jquery');
                    $('form input.ng-invalid,form select.ng-invalid,form textarea.ng-invalid,form [data-required$=false]').each(function(){
                        var ftop = $('[ng-view]').offset().top;
                        var $thisTop = $(this).offset().top;
                        var diff = $thisTop - ftop;
                        $('div.site-content').scrollTop(diff-50);
                        if($thisTop)
                            return false;
                    });
                }
            });

        }
    };
})
.directive('confirmPairField',function(){
    return{
        require: 'ngModel',
        restrict: 'A',
        link: function(scope,elem,attr,ctrl){

            scope.$watch(attr.ngModel, function() {
                confirmPairFieldValidation();
            });
            scope.$watch(attr.linkField, function() {
                confirmPairFieldValidation();
            });
            function confirmPairFieldValidation(){
                if(!$(elem).val() && !scope.$eval(attr.linkField)){
                    return true;
                }
                if ($(elem).val() === scope.$eval(attr.linkField)) {
                    ctrl.$setValidity('confirmField', true);
                } else {
                    ctrl.$setValidity('confirmField', false);
                }
                return $(elem).val();
            }
            ctrl.$parsers.push(confirmPairFieldValidation);
        }
    }
})
.directive('passwordLengthCheck',function(){
    return {
        require: 'ngModel',
        link: function(scope, element, attr, passwordLengthCtrl) {
            function passwordLengthValidation(value) {
                if (value.length >= 8) {
                    passwordLengthCtrl.$setValidity('passwordLength', true);
                } else {
                    passwordLengthCtrl.$setValidity('passwordLength', false);
                }
                return value;
            }
            passwordLengthCtrl.$parsers.push(passwordLengthValidation);
        }
    };
});