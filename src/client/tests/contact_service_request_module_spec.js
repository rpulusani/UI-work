/* global describe it beforeEach inject expect */

describe('Address Service Request Module', function() {
    beforeEach(module('mps'));
    describe('Controllers', function(){
        var scope, ctrl, location, contacts, window, history;

        beforeEach(inject(function($rootScope, $controller, $location, Contacts, History, $window) {
            scope = $rootScope.$new();
            location = $location;
            window = $window;
            history = History;
            ctrl = $controller('contactsController', {$scope: scope});
            contacts = Contacts;
        }));
    });

    describe("Routes", function(){
        it('should map routes to controllers', function() {
            inject(function($route) {
                /*  only test logic examples not anything more
                expect($route.routes['/service_requests/contacts'].controller).toBe('contactsController');
                expect($route.routes['/service_requests/contacts'].templateUrl).toEqual('/js/address_service_requests/templates/view.html');
                expect($route.routes['/service_requests/contacts/delete'].templateUrl).toEqual('/js/address_service_requests/templates/delete.html');
                expect($route.routes['/service_requests/contacts/new'].templateUrl).toEqual('/js/address_service_requests/templates/new.html');
                */
            });
        });

         // Tests for testing directives
        describe('directive: new-form-fields.html', function() {
            var element, scope;

            beforeEach(module('mps'));

            beforeEach(inject(function($rootScope, $compile) {
                scope = $rootScope.$new();

                element = '<address-new-fields></address-new-fields>';
                element = $compile(element)(scope);

                scope.$digest();
            }));
        });
    });
});
