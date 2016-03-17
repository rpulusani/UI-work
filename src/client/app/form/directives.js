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
.directive('datepicker', [function () {
    return {
      restrict: 'A',
      scope: {
          appendTo: '=',
          autoClose: '=',
          autoHideOnBlur: '=',
          autoHideOnClick: '=',
          date: '=',
          dateValidator: '&',
          dayFormat: '=',
          initialValue: '=',
          inputFormat: '=',
          invalidate: '=',
          max: '=',
          min: '=',
          monthFormat: '=',
          monthsInCalendar: '=',
          required: '=',
          strictParse: '=',
          time: '=',
          timeFormat: '=',
          timeInterval: '=',
          timeValidator: '&',
          weekdayFormat: '=',
          dateVal: '='
      },
      controller: 'DatePickerController'
    };
}])
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
}])
.directive('selectric', [function() {
  return {
    restrict: 'AC',
    scope: {
      options: '=',
      label: '@',
      value: '@',
      placeholder: '@',
      model: '=',
      onSelect: '&',
      onInit: '&'
    },
    link: function(scope, element, attrs) {
      var selectric = null;
      var last = {
        options: null,
        label: null,
        value: null,
        model: null,
        placeholder: null
      };
      var dirty = function(values) {
        var newv = {
          options: values[0],
          label: values[1],
          value: values[2],
          model: values[3],
          placeholder: values[4]
        };
        if(JSON.stringify(last) == JSON.stringify(newv)) {
          return false;
        } else {
          return newv;
        }
      };
      scope.$watchGroup(['options', 'label', 'value', 'model', 'placeholder'],
      function(values) {
        var newv = dirty(values);
        if(!newv) {
          return;
        } else {
          last = newv;
        }
        var options = values[0];
        var label = values[1];
        var value = values[2];
        var model = values[3];
        var placeholder = values[4];
        var selectedVal = '';

        if(selectric) {
          selectric.selectric('destroy');
        }
        $ = require('jquery');
        selectric = $('<select></select>');
        if(placeholder) {
          selectric.append(
            $('<option value=""></option>').text(placeholder)
          );
        }
        if(!options) {
          options = [];
        }
        $.each(options, function(_index, item) {
          if (item[label]) {
            var option = $('<option></option>').attr('value', item[value]).text(item[label]);

            if (model === item[label]) {
              option.attr('selected', 'selected');
              selectedVal = item[value];
            }

            selectric.append(option);
          }
        });

        element.empty();
        element.append(selectric[0]);
        selectric.selectric({
           onChange: function(){
             var val = selectric.val();
             scope.$apply(function(scope) {
               last.model = scope.model = val;
               if(scope.onSelect) {
                 var option = null;
                 $.each(options, function(_index, item) {
                   if(item[value] == val) {
                     option = item;
                   }
                 });
                 if(val === ''){
                  option = {};
                 }
                 scope.onSelect({option: option});
               }
             });
           }
        });

        selectric.val(selectedVal).selectric('refresh').change();
      });
      scope.$on('$destroy', function() {
        selectric.selectric('destroy');
      });
    }
  };
}]);
