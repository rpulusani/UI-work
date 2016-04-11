
angular.module('mps.serviceRequestContacts')
.directive('newContactFields', function() {
    return {
        restrict: 'A',
        templateUrl: '/app/contact_service_requests/templates/contact-fields.html'
    };
})
.directive('contactUpdateAddressFields', function() {
    return {
        restrict: 'A',
        templateUrl: '/app/contact_service_requests/templates/contact-update-address-fields.html'
    };
})
.directive('contactUpdateInfoFields', function() {
    return {
        restrict: 'A',
        templateUrl: '/app/contact_service_requests/templates/contact-update-info-fields.html',
        controller: 'ContactUpdateController'
    };
})
.directive('contactUpdateAddressForm', function() {
    return {
        restrict: 'A',
        templateUrl: '/app/contact_service_requests/templates/contact-update-address-form.html',
        controller: 'ContactUpdateAddressController'
    };
})
.directive('contactUpdateTabs', function() {
    return {
        restrict: 'A',
        templateUrl: '/app/contact_service_requests/templates/contact-update-tabs.html',
        controller: 'ContactUpdateTabController',
        link: function(scope, el, attr){
            var $ = require('jquery');
            var sets = $(el).find("[data-js=tab], [data-js=set], [data-js=accordion]");
            sets.each(function(i,set){
                $(set).set({});
            });
            
        }
    };
});
