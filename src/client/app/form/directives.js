angular.module('mps.form')
.directive('input',[
    function(){
        return {
            restrict: 'E',
            require: ['?ngModel'],
            link: function(scope, el, attr, model){
                if (!model || model.length < 1) {
                   return;
                }
                var $ = require('jquery');
                switch(el[0]["type"]){
                    case 'checkbox':
                        $(el).customInput();
                    break;
                    case 'radio':
                        $(el).customInput();
                    break;
                }
            }
        };
    }
])
.directive('select', function(){
    return {
        restrict: 'E',
        link: function(scope, element, attrs) {
            alert('123');
            
           // $(element).selectric();
        }
    };
});
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
