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
                scope.dog="bow wow";
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
                expect($(elm).attr("class")).toBe("form__field form__field--checkbox");

                $httpBackend.flush();
            });
            
            it("should have the front end framework turn on and checked saves to scope", function(){
                scope.cat = "furry";
                var elementCheckboxHtml =
                    compileDirective('<div class="form__field"><input id="test" type="checkbox" ng-model="cat" data-js="customInput"/><label for="test"><span ></span>test</label></div>');
                expect(scope.cat).toBe("furry");
                $(elm).find("input").click();
                expect(scope.cat).toBe(true);
                $httpBackend.flush();
            });
            it("should have the front end framework turn on and checked saves to scope", function(){
                scope.cat = "furry";
                var elementCheckboxHtml =
                    compileDirective('<div class="form__field"><input id="test" type="checkbox" ng-model="cat" ng-true-value="\'hairless\'" data-js="customInput"/><label for="test"><span ></span>test</label></div>');
                expect(scope.cat).toBe("furry");
                $(elm).find("input").click();
                expect(scope.cat).toBe("hairless");
                $httpBackend.flush();
            });

            it("should have the front end framework turn on and unchecked saves to scope", function(){
                scope.cat = "furry";
                var elementCheckboxHtml =
                    compileDirective('<div class="form__field"><input id="test" type="checkbox" ng-model="cat" ng-false-value="\'long-haired\'" ng-true-value="\'hairless\'" data-js="customInput"/><label for="test"><span ></span>test</label></div>');
                expect(scope.cat).toBe("furry"); //start state
                $(elm).find("input").click(); //check
                expect(scope.cat).toBe("hairless");
                $(elm).find("input").click(); //uncheck
                expect(scope.cat).toBe("long-haired");
                $httpBackend.flush();
            });


        });

        describe('input of type radio', function(){
            it('should fail if ngModel is not specified', function () {
                expect(function(){
                    getCompiledElement('<div class="form__field"><input id="test" type="radio" data-js="customInput"/><label><span for="test"></span>test</label></div>');
                }).toThrow();
                 $httpBackend.flush();
            });

            it("should have the front end framework turn on", function(){
                var elementRadioHtml =
                    compileDirective('<div class="form__field"><input id="test" type="radio" ng-model="cat" data-js="customInput"/><label><span for="test"></span>test</label></div>');
                expect(elm).toBeDefined();
                expect($(elm).attr("class")).toBe("form__field form__field--radio");

                $httpBackend.flush();
            });
            it("should have the front end framework turn on and clicked saves to scope", function(){
                scope.cat = "furry";
                var elementCheckboxHtml =
                    compileDirective('<div class="form__field"><input id="test" type="radio" value="hairless" ng-model="cat" data-js="customInput"/><label for="test"><span ></span>test</label></div>');
                expect(scope.cat).toBe("furry");
                $(elm).find("input").click();
                expect(scope.cat).toBe("hairless");
                $httpBackend.flush();
            });
        });


      describe('input of type text', function(){
            it('should fail if ngModel is not specified', function () {
                expect(function(){
                    getCompiledElement('<div class="form__field"><input id="test" type="radio" data-js="customInput"/><label><span for="test"></span>test</label></div>');
                }).toThrow();
                 $httpBackend.flush();
            });

            it("should not have the front end framework turn on", function(){
                var elementTextHtml =
                    compileDirective('<div class="form__field"><input id="test" type="text" ng-model="cat" data-js="customInput"/><label><span for="test"></span>test</label></div>');
                expect(elm).toBeDefined();
                expect($(elm).attr("class")).toBe("form__field");

                $httpBackend.flush();
            });
        });
        describe('input of type select', function(){
            it("should have the front end framework turn on", function(){
                var selectBoxHtml =
                    compileDirective('<div class="form__field"><select id="test" data-js="customInput"><option value="">--select--</option><option>USA</option></select></div>');
                    expect(elm).toBeDefined();
                    expect($(elm).find("div.selectric")).toBeDefined();
                    $httpBackend.flush();
            });

            it("should have the front end framework turn on and default selected", function(){
                var selectBoxHtml =
                    compileDirective('<div class="form__field"><select id="test" data-js="customInput"><option value="">--select--</option><option>USA</option></select></div>');
                    expect(elm).toBeDefined();
                    expect($(elm).find("li.selected")).toBeDefined();
                    expect($(elm).find("li.selected").html()).toBe("--select--");
                $httpBackend.flush();
            });
            it("should have the front end framework turn on and select non default", function(){
                var selectBoxHtml =
                    compileDirective('<div class="form__field"><select id="test" data-js="customInput"><option value="">--select--</option><option>USA</option></select></div>');
                    expect(elm).toBeDefined();
                    expect($(elm).find("li.selected")).toBeDefined();
                    expect($(elm).find("li.selected").html()).toBe("--select--");
                    $(elm).find("select").val("USA");
                    $(elm).find("select").selectric("refresh");
                    expect($(elm).find("li.selected").html()).toBe("USA");
                $httpBackend.flush();
            });

            it("should have the front end framework turn on and default selected", function(){
                var selectBoxHtml =
                    compileDirective('<div class="form__field"><select id="test" data-js="customInput"><option value="">--select--</option><option>USA</option></select></div>');
                    expect(elm).toBeDefined();
                    expect($(elm).find("li.selected")).toBeDefined();
                    expect($(elm).find("li.selected").html()).toBe("--select--");
                    $(elm).find("select").val("USA");
                    $(elm).find("select").selectric("refresh");
                    expect($(elm).find("li.selected").html()).toBe("USA");
                $httpBackend.flush();
            });
            it("should have the front end framework turn on and scope is different", function(){
                scope.cat = "";
                var selectBoxHtml =
                    compileDirective('<div class="form__field"><select id="test" data-js="customInput" ng-model="cat"><option value="">--select--</option><option>USA</option></select></div>');
                    expect(elm).toBeDefined();
                    expect($(elm).find("li.selected")).toBeDefined();
                    expect($(elm).find("li.selected").html()).toBe("--select--");
                    
                    console.log("selectric " + $(elm).find(".selectric"));
                    $(elm).find(".selectric").click();
                    var option1 = $(elm).find("li");
                    console.log(option1);
                    option1.click();
                    $(elm).find("#test").selectric("refresh");
                    expect($(elm).find("li.selected").html()).toBe("USA");
                    expect(scope.cat).toBe("USA");
                $httpBackend.flush();
            });
        });
    });
});
});
