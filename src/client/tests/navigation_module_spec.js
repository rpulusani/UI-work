describe('Navigation Module', function() {
    beforeEach(module('mps'));
    describe('Controllers', function(){
           var scope, ctrl, location, addresses;

        beforeEach(inject(function($rootScope, $controller, $location, Addresses) {
            scope = $rootScope.$new();
            location = $location;
            ctrl = $controller('TopNavigationController', {$scope: scope});
            addresses = Addresses;
        }));

        describe('$scope.goTo', function(){
            it('sets the route of the angular app', function(){
                spyOn(location, 'path').and.returnValue('/service_request');
                scope.goTo('/service_request');
                expect(location.path).toHaveBeenCalled();
            });
            it('sets the route of the angular app', function(){
                spyOn(location, 'path').and.returnValue('/');
                scope.goTo('/');
                expect(location.path).toHaveBeenCalled();
            });
        });

        describe('$scope.isSelected', function(){
            it('checks a passed in route and validates that is matches what the browser window is located.  Pass in a good route.', function(){
              var result  = false,
              service = new BaseService();
             spyOn(location, 'path').and.returnValue('/cat');
              result = scope.isSelected('/cat');
              expect(result).toEqual(true);
            });

           it('checks a passed in route and validates that is matches what the browser window is located.  Pass in long route.', function(){
              var result  = false,
              service = new BaseService();
              spyOn(location, 'path').and.returnValue('/cat/kittens/1');
              result = scope.isSelected('/cat');
              expect(result).toEqual(true);
            });

            it('checks a passed in route and validates that is matches what the browser window is located.  Pass in root route.', function(){
              var result  = true,
              service = new BaseService();
              spyOn(location, 'path').and.returnValue('/cat/kittens/1');
              result = scope.isSelected('/');
              expect(result).toEqual(false);
            });


            it('checks a passed in route and validates that is matches what the browser window is located.  Pass in  a bad route.', function(){
              var result  = true,
              service = new BaseService();
              spyOn(location, 'path').and.returnValue('/dog');
              result = scope.isSelected('/cat');
              expect(result).toEqual(false);
            });
        });

    });
    describe('Directives', function(){
        //none needed
    });
    describe("Routes", function(){
        it('should map routes to controllers', function() {
           inject(function($route) {
            // none needed
           });
        });
        it('should map to default', function(){
            inject(function($route) {
                expect($route.routes[null].templateUrl).toEqual('/js/dashboard/templates/home.html');
                expect($route.routes['/cat']).toEqual(undefined);
            });
        });
    });
});
