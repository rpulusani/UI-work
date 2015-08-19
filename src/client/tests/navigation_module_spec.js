describe('Navigation Module', function() {
    beforeEach(module('mps'));
    describe('Controller: TopNavController', function(){
        var scope, ctrl, location, addresses;

        beforeEach(inject(function($rootScope, $controller, $location, Addresses) {
            scope = $rootScope.$new();
            location = $location;
            ctrl = $controller('TopNavController', {$scope: scope});
            addresses = Addresses;
        }));

        describe('$scope.isSelected', function(){
            it('checks a passed in route and validates that is matches what the browser window is located.  Pass in a good route.', function(){
              var result  = false;
             spyOn(location, 'path').and.returnValue('/cat');
              result = scope.isSelected('/cat');
              expect(result).toEqual(true);
            });

           it('checks a passed in route and validates that is matches what the browser window is located.  Pass in long route.', function(){
              var result  = false;
              spyOn(location, 'path').and.returnValue('/cat/kittens/1');
              result = scope.isSelected('/cat');
              expect(result).toEqual(true);
            });

            it('checks a passed in route and validates that is matches what the browser window is located.  Pass in root route.', function(){
              var result  = true;
              spyOn(location, 'path').and.returnValue('/cat/kittens/1');
              result = scope.isSelected('/');
              expect(result).toEqual(false);
            });

            it('checks a passed in route and validates that is matches what the browser window is located.  Pass in  a bad route.', function(){
              var result  = true;
              spyOn(location, 'path').and.returnValue('/dog');
              result = scope.isSelected('/cat');
              expect(result).toEqual(false);
            });
        });
    });

    describe('Controller: LeftNavController', function(){
      var scope, ctrl, location, addresses;
      
      beforeEach(inject(function($rootScope, $controller, $location, Addresses) {
            scope = $rootScope.$new();
            location = $location;
            ctrl = $controller('LeftNavController', {$scope: scope});
            addresses = Addresses;
        }));

        describe('$scope.isHeader', function(){
            it('if object in the navigation file is header by passing good value', function(){
                var tags = ["top","header"];
                var result = scope.isHeader(tags);
                expect(result).toEqual(true);
            });
            it('if object in the navigation file is header by passing bad value', function(){
                var tags = ["top"];
                var result = scope.isHeader(tags);
                expect(result).toEqual(false);
            });
            it('if object in the navigation file is header by passing blank value', function(){
                var tags = "";
                var result = scope.isHeader(tags);
                expect(result).toEqual(false);
            });
        });

        describe('$scope.hasChildren', function(){
            it('if object in the navigation file has children by passing in children value', function(){
                var children = ["cat","dog"];
                var result = scope.hasChildren(children);
                expect(result).toEqual(true);
            });
            it('if object in the navigation file has children by passing in blank value', function(){
                var children = "";
                var result = scope.hasChildren(children);
                expect(result).toEqual(false);
            });
        });

         describe('$scope.hasThisChild', function(){
            it('whether the children attribute of a navigation object has a specific child by passing good value', function(){
                var children = ["cat","dog"];
                var child = "dog";
                var result = scope.hasThisChild(children,child);
                expect(result).toEqual(true);
            });
            it('whether the children attribute of a navigation object has a specific child by passing bad value', function(){
                var children = ["cat","dog"];
                var child = "mouse";
                var result = scope.hasThisChild(children,child);
                expect(result).toEqual(false);
            });
            it('whether the children attribute of a navigation object has a specific child by passing blank children', function(){
                var children = "";
                var child = "mouse";
                var result = scope.hasThisChild(children,child);
                expect(result).toEqual(false);
            });
            it('whether the children attribute of a navigation object has a specific child by passing blank child', function(){
                var children = ["cat","dog"];
                var child = "";
                var result = scope.hasThisChild(children,child);
                expect(result).toEqual(false);
            });
          });
          describe('$scope.isChild', function(){
            it('checks whether an object in the navigation file is a child by passing correct value', function(){
                //spyOn(scope, 'navArray').and.returnValue("[{'children':['cats','dogs']},{'children':''}]");
                var dataArray = [{"children":"cats"}];
                var result = scope.isChild("cats",dataArray);
                expect(result).toEqual(true);
            });
            it('checks whether an object in the navigation file is a child by passing blank value', function(){
                var dataArray = [{'children':['cats','dogs']},{'children':''}];
                var result = scope.isChild("",dataArray);
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
                expect($route.routes[null].templateUrl).toEqual('/app/dashboard/templates/home.html');
                expect($route.routes['/cat']).toEqual(undefined);
            });
        });
    });
});
