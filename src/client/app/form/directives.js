angular.module('mps.form')
.directive('input',[
    function(){
        console.log("entered 1 2 3");
        return {
            restrict: 'E',
            require: ['ngModel'],
            link: function(scope, el, attr, model){
                    console.log("entered 4 5 6");
                    (function(require) {
                        require(['lxk.fef'], function() {
                            console.log("entered 7 8 9");
                            if (!model || model.length < 2) {
                                    return;
                            }
                            console.log("entered?");
                            var $ = require('jquery');
                            switch(el[0]["type"]){
                                case 'checkbox':
                                    $(el).customInput();
                                break;
                                case 'radio':
                                    $(el).customInput();
                                break;
                            }
                        });
                    })(require);
            }
        };
    }
])
.directive('select', [
        function() {
            return {
                restrict: 'E',
                require: ['?select', '?ngModel'],
                link: {
                    post: function(scope, el, attr, model) {
                        (function(require) {
                            require(['lxk.fef'], function() {
                                if (!model || model.length < 2) {
                                    return;
                                }
                                var $ = require('jquery');
                                if(el.length > 0){
                                    var options = el[0]["options"],
                                    length = el[0]["options"].length;
                                   for(var i = 0; i < length; ++i){
                                    if(options[i]["defaultSelected"]){
                                        var value =  options[i]["value"];
                                         model[1].$setViewValue(value);
                                    }
                                   }
                                }
                                $(el).selectric({
                                    onChange: function(){
                                       var value = $(el).val();
                                        model[1].$setViewValue(value);
                                    }
                                });
                                scope.$watch(function() {
                                    return el[0].length;
                                }, function() {
                                    $(el).selectric('refresh');
                                });
                                scope.$on('$destroy', function() {
                                    $(el).selectric('destroy');
                                });
                            });
                        })(require);
                    }
                }
            };
        }
    ])
.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel),
            modelSetter = model.assign;
            
            element.bind('change', function() {
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);
