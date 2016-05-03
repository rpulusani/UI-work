angular.module('mps.utility')
.directive('emailValid',function(){
    return {
        require: 'ngModel',
        link: function(scope, element, attr, emailCtrl) {
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
                var cityExpression = /^[a-zA-Z0-9\s]{1,50}$/;
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
});