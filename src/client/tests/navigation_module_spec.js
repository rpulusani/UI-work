describe('Navigation Module', function() {
    beforeEach(module('mps'));
    describe('Controllers', function(){
           var scope, ctrl, location, addresses;

        beforeEach(inject(function($rootScope, $controller, $location, Addresses) {
            scope = $rootScope.$new();
            location = $location;
            ctrl = $controller('NavigationController', {$scope: scope});
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

        describe('$scope.isHeader', function(){
            it('checks whether an object in the navigation file is a header or not. Pass in good value', function(){
                var tags = ["top","header"];
                var result = scope.isHeader(tags);
                expect(result).toEqual(true);
            });
            it('checks whether an object in the navigation file is a header or not. Pass in bad value', function(){
                var tags = ["top"];
                var result = scope.isHeader(tags);
                expect(result).toEqual(false);
            });
            it('checks whether an object in the navigation file is a header or not. Pass in blank value', function(){
                var tags = "";
                var result = scope.isHeader(tags);
                expect(result).toEqual(false);
            });
        });

        describe('$scope.hasChildren', function(){
            it('checks whether an object in the navigation file has children or not. Pass in children value', function(){
                var children = ["cat","dog"];
                var result = scope.hasChildren(children);
                expect(result).toEqual(true);
            });
            it('checks whether an object in the navigation file has children or not. Pass in blank value', function(){
                var children = "";
                var result = scope.hasChildren(children);
                expect(result).toEqual(false);
            });
        });

         describe('$scope.hasThisChild', function(){
            it('checks whether the children attribute of a navigation object has a specific child. Pass in good value', function(){
                var children = ["cat","dog"];
                var child = "dog";
                var result = scope.hasThisChild(children,child);
                expect(result).toEqual(true);
            });
            it('checks whether the children attribute of a navigation object has a specific child. Pass in bad value', function(){
                var children = ["cat","dog"];
                var child = "mouse";
                var result = scope.hasThisChild(children,child);
                expect(result).toEqual(false);
            });
            it('checks whether the children attribute of a navigation object has a specific child. Pass in blank value for children list', function(){
                var children = "";
                var child = "mouse";
                var result = scope.hasThisChild(children,child);
                expect(result).toEqual(false);
            });
            it('checks whether the children attribute of a navigation object has a specific child. Pass in blank value for child', function(){
                var children = ["cat","dog"];
                var child = "";
                var result = scope.hasThisChild(children,child);
                expect(result).toEqual(false);
            });

          describe('$scope.isChild', function(){
            it('checks whether an object in the navigation file is a child or not by looking in the parent value. Pass in parent value', function(){
                var parent = "cat";
                var result = scope.isChild(parent);
                expect(result).toEqual(true);
            });
            it('checks whether an object in the navigation file is a child or not by looking in the parent value. Pass in blank value', function(){
                var parent = "";
                var result = scope.isChild(parent);
                expect(result).toEqual(false);
            });
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
