angular.module('mps.form')
.directive('mpsUpdateForm',['$timeout','$parse',
    function($timeout, $parse){
      return {
        restrict: 'A',
        require: ['^form'],
        link: function(scope, elm, attrs, form){
          var self = {};
          self.elm = elm;
          self.form = form[0];
          self.scope = scope;
          self.scope.inputs = [];
          self.scope.inputsUnchanged = [];
          self.attrs = attrs;
          var $ = require('jquery');
          $timeout(function(){
             var cb = $parse(attrs.formOnChange);
             for(var i = 0; i < elm[0].length; ++i){
                if(form[0][elm[0][i].name]){
                  var item = {
                    name: elm[0][i].name,
                    id: elm[0][i].id,
                    elm: elm[0][i],
                    model: form[0][elm[0][i].name],
                    originalValue: form[0][elm[0][i].name].$modelValue
                  };
                  self.scope.inputs.push(item);
                  editValidation(item);
                  $(item.elm).on('blur keyup change', function(event) {
                    var name = $(event.target).attr('name');
                    var item = self.scope.inputs.find(function(val){
                      return name === val.name;
                    });
                    if(item){
                      editValidation(item);
                    }
                  });
                }
              }
          },200);

          function editValidation(item){
            var indexes = $.map(self.scope.inputsUnchanged, function(obj, index) {
                    if(obj.name === item.name && obj.id === item.id) {
                        return index;
                    }
              }),
              firstIndex = indexes[0];
              console.log("**************************************");
              console.log("Unchanged Array: ", self.scope.inputsUnchanged );
              console.log("Item Array: ", self.scope.inputs );
              if(item.originalValue === item.model.$viewValue){
                if(firstIndex === undefined || firstIndex === -1){
                  console.log("Adding: " + item.name +" original value: " + item.originalValue + " New Value: "+ item.model.$viewValue);
                  self.scope.inputsUnchanged.push(item);
                  console.log("Unchanged Array: ", self.scope.inputsUnchanged );
                }
              }else{
                if(firstIndex > -1){
                  console.log("Removing: " + item.name +" original value: " + item.originalValue + " New Value: "+ item.model.$viewValue);
                  console.log("index to be removed: " + firstIndex);
                  self.scope.inputsUnchanged.splice(firstIndex,1);
                  console.log("Unchanged Array: ", self.scope.inputsUnchanged );
                }
              }

              if(self.scope.inputs.length > self.scope.inputsUnchanged.length){
                console.log("Setting Valdition as valid Form: " + item.name +" original value: " + item.originalValue + " New Value: "+ item.model.$viewValue);
                self.form.$setValidity('mpsUpdateForm', true);
              }else{
                console.log("Setting Valdition as Invalid Form: " + item.name +" original value: " + item.originalValue + " New Value: "+ item.model.$viewValue);
                self.form.$setValidity('mpsUpdateForm', false);
                self.form.$setPristine();
                self.form.$setUntouched();
              }
              console.log("Errors: ", self.form.$error);
              console.log("Invalid Property: ", self.form.$invalid);
              console.log("Valid Property: ", self.form.$valid);
              console.log("Pristine: ", self.form.$pristine);

              console.log("Unchanged Array: ", self.scope.inputsUnchanged );
              console.log("Item Array: ", self.scope.inputs );
              console.log("Unchanged Length: " + self.scope.inputsUnchanged.length + ",  Item Array: " + self.scope.inputs.length);
              console.log("**************************************");

              return;
          }
        }
      };
    }
])
.directive('mpsUpdate',['$timeout',
    function($timeout){
      return {
        restrict: 'E',
        require: ['ngModel'],
        link: function(scope, elm, attrs, model){
          var self = {};
           if(!model || model.length < 1){
            return;
           }

            self.elm = elm;
            self.model = model[0];
            self.scope = scope;
            self.attrs = attrs;
            self.elm.on('blur keyup change', function() {
                scope.$evalAsync(editValidation);
            });
            $timeout(function(){
              self.orignalValue = angular.copy(self.model.$modelValue);
               editValidation();
            }, 0);
            function editValidation(){
              if(self.orignalValue === self.model.$viewValue){
                self.model.$setValidity('mpsUpdate', false);
              }else{
                self.model.$setValidity('mpsUpdate', true);
              }
              return;
            }
        }
      };
    }
  ])
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
                       // $(el).customInput();
                    break;
                    case 'radio':
                      //$(el).customInput();
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
      onSelect: '&'
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
                 if(val == ''){
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
