define(['angular','angular-mocks', 'form','lxk.fef','jquery'], function(angular, mocks, form, fef,$) {
describe('Form Module', function() {
    beforeEach(module('mps'));
    describe('directives', function(){
          var elm,        // our directive jqLite element
                scope,      // the scope where our directive is inserted
                httpBackend;
         beforeEach(inject(function($rootScope, $compile, _$httpBackend_) {
                scope = $rootScope.$new();
                $httpBackend = _$httpBackend_;

                $httpBackend.when('GET', '/etc/resources/i18n/en.json').respond({it: 'works'});
                $httpBackend.when('GET', '/app/dashboard/templates/home.html').respond("<h1>home</h1>");
            }));


        function compileDirective(tpl) {
        // function to compile a fresh directive with the given template, or a default one
        // compile the tpl with the $rootScope created above
        // wrap our directive inside a form to be able to test
        // that our form integration works well (via ngModelController)
        // our directive instance is then put in the global 'elm' variable for further tests
            tpl = '<form name="form">' + tpl + '</form>';
            // inject allows you to use AngularJS dependency injection
            // to retrieve and use other services
            inject(function($compile) {
                var form = $compile(tpl)(scope);
                elm = form.find('div');
            });
            // $digest is necessary to finalize the directive generation
            scope.$digest();
        }

        afterEach(function () {
          $httpBackend.verifyNoOutstandingExpectation();
          $httpBackend.verifyNoOutstandingRequest();
        });

        describe('input of type checkbox', function(){
            it('should fail if ngModel is not specified', function () {
                expect(function(){
                    getCompiledElement('<div class="form__field"><input id="test" type="checkbox" data-js="customInput"/><label><span for="test"></span>test</label></div>');
                }).toThrow();
                 $httpBackend.flush();
            });

            it("should have the front end framework turn on", function(){
                var elementCheckboxHtml =
                    compileDirective('<div class="form__field"><input id="test" type="checkbox" ng-model="cat" data-js="customInput"/><label><span for="test"></span>test</label></div>');
                expect(elm).toBeDefined();
                console.log($(elm).attr("class"));
                expect($(elm).attr("class")).toBe("form__field form__field--check");

                $httpBackend.flush();
            });
        });
    });
});
});
