define(['angular', 'angular-mocks', 'nav'], function(angular, mocks, nav){
    describe("Nav Module", function(){
        beforeEach(module('mps'));

        describe("Nav Controller", function(){
            var scope, location, nav, ctrl;
            beforeEach(inject(function($rootScope, $controller, $location, Nav){
                scope = $rootScope.$new();
                location = $location;
                nav = Nav;
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
                    //console.log('ctrl items: ' + scope.items.length);
                    //console.log('nav items: ' + nav.items.length);
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
