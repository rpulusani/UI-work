define(['angular', 'angular-mocks', 'nav', 'nav.navFactory', 'nav.navItemFactory'], function(angular, mocks, nav){
    describe("Nav Module", function(){
        beforeEach(module('mps'));

        describe("Nav Controller", function(){
            var scope, location, nav, item, ctrl, mockItems, mockNavFactory;

            beforeEach(inject(function($rootScope, $controller, $location, Nav, NavItem){
                scope = $rootScope.$new();
                location = $location;
                nav = Nav;
                item = NavItem;
                ctrl = $controller('NavController', {$scope: scope});
            }));

            describe("When the nav is loaded", function() {
/*
                beforeEach(function(){
                    if (scope.items.length === 0) {
                        nav.query(function(){
                            scope.items = nav.items;
                        });
                    }
                });

                it("has access the the nav menu", function(){
                    expect(scope.items).toBe(nav.items);
                });
*/
            });
        });

        describe("Nav Factory", function() {
            var scope, location, nav, item, ctrl, mockItems, mockNavFactory;

            beforeEach(function (){
                mockNavFactory = {
                    query: jasmine.createSpy(),
                    getItemsByTag: jasmine.createSpy(),
                    geTags: jasmine.createSpy()
                };

                module(function($provide) {
                    $provide.value('Nav', mockNavFactory);
                });
            });

            beforeEach(inject(function($rootScope, $controller, $location) {
                scope = $rootScope.$new();
                location = $location;
                ctrl = $controller('NavController', {$scope: scope});
            }));

            it('getItemsByTag() - return array of matched items', function() {
                mockNavFactory.getItemsByTag('primary');

                expect(mockNavFactory.getItemsByTag).toHaveBeenCalled();
            });

            it('getTags() - looks through items that match', function() {

            });

            it('query() - should get the navigation outline from a flat file', function() {
                mockNavFactory.query();

                console.log(scope.items);

                expect(mockNavFactory.query).toHaveBeenCalled();
            });
        });

        describe("Nav Item Factory", function(){

        });

        describe("Nav Directives", function(){

        });
    });
});
