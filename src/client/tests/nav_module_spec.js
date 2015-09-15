define(['angular', 'angular-mocks', 'nav', 'nav.navFactory', 'nav.navItemFactory'], function(angular, mocks, nav){
    describe("Nav Module", function(){
        beforeEach(module('mps'));

        describe("Nav Controller", function(){
            var scope, location, nav, item, ctrl, mockItems;

            beforeEach(inject(function($rootScope, $controller, $location, Nav, NavItem){
                scope = $rootScope.$new();
                location = $location;
                nav = Nav;
                item = NavItem;
                ctrl = $controller('NavController', {$scope: scope});
            }));

            describe("When the nav is loaded", function(){

                beforeEach(function(){
                    if(scope.items.length === 0){
                        nav.query(function(){
                            scope.items = nav.items;
                        });
                    }
                });

                it("has access the the nav menu", function(){
                    expect(scope.items).toBe(nav.items);
                });
            });
        });

        describe("Nav Factory", function(){

        });

        describe("Nav Item Factory", function(){

        });

        describe("Nav Directives", function(){

        });
    });
});
