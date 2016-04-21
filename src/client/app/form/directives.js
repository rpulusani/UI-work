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
                  if(elm[0][i].attributes && elm[0][i].attributes['default'] && elm[0][i].attributes['default'].value){
                    item.originalValue = elm[0][i].attributes['default'].value;
                    console.log(elm[0][i]);
                    watchSpecialInputs(elm[0][i]);
                  }
                  self.scope.inputs.push(item);
                  editValidation(item);
                  $(item.elm).on('blur keyup change', function(event) {
                    var name = $(event.target).attr('name');
                    getItemValidation(name);
                  });
                }
              }
          },200);
          function getItemValidation(name){
            var item = self.scope.inputs.find(function(val){
                      return name === val.name;
                    });
                    if(item){
                      editValidation(item);
                    }
          }
          function watchSpecialInputs(currentElement){
            if(currentElement.attributes && currentElement.attributes['ng-model'] && currentElement.attributes['ng-model'].value){
              scope.$watch(currentElement.attributes['ng-model'].value, function(newValue, oldValue){
                console.log('watching model: ', currentElement.name);
                console.log('watching newValue: ', newValue);
                console.log('watching oldValue: ', oldValue);
                getItemValidation(currentElement.name);
              });
            }
          }
          function editValidation(item){
            var indexes = $.map(self.scope.inputsUnchanged, function(obj, index) {
                    if(obj.name === item.name && obj.id === item.id) {
                        return index;
                    }
              }),
              firstIndex = indexes[0];
              console.log('Input New Value: ' + item.model.$viewValue);
              if(item.originalValue === item.model.$viewValue){
                if(firstIndex === undefined || firstIndex === -1){
                  self.scope.inputsUnchanged.push(item);
                }
              }else{
                if(firstIndex > -1){
                  self.scope.inputsUnchanged.splice(firstIndex,1);
                }
              }

              if(self.scope.inputs.length > self.scope.inputsUnchanged.length){
                self.form.$setValidity('mpsUpdateForm', true);
              }else{
                self.form.$setValidity('mpsUpdateForm', false);
                self.form.$setPristine();
                self.form.$setUntouched();
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
          dateVal: '=',
          beforeEq: '=',
          beforeEqNow: '=',
          afterEq: '='
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
.directive('countrySelect', [function () {
    return {
        restrict: 'A',
        scope: {
            country: '=country',
            countryIsoCode: '=code',
            state: '=?state',
            required: '=?required',
            form:'=?form'
        },
        template: '<div class="form__field form__field--select" ' + 
            'ng-class="{\'form__field--has-alert\' : required && (form.$submitted && !form.country.$valid), ' +
            ' \'form__field--required\' : required === true}">' +
            '<label translate="ADDRESS_MAN.COMMON.TXT_COUNTRY"></label>' +
            '<select name="country" ng-model="countryIsoCode" ng-change="countrySelected(countryIsoCode)" ng-required="required">' +
            '<option value="" translate="LABEL.SELECT" ng-selected="!countryService.item"></option>' +
            '<option ng-repeat="c in countryService.data track by c.code" value="{{ c.code }}" ng-selected="c.name === country">' +
                '{{c.name}}' +
            '</option>' +
        '</select>' +
        '<span ng-show="required && (form.$submitted && !form.country.$valid)" class="form__field__helper-text form__field__helper-text--alert">' +
            '<i class="icon icon--ui icon--error-small"></i>' +
            '<span translate="LABEL.ERROR_REQUIRED"></span>' +
        '</span></div>',
        controller: [
            '$scope',
            '$element',
            '$attrs',
            'CountryService',
            function($scope, $ele, $attrs, CountryService) {
                var setupCountrySelect = function() {
                    CountryService.item = null;
                    
                    if ($scope.country && !CountryService.item) {
                        CountryService.setCountryByName($scope.country);
                    } else if ($scope.countryIsoCode) {
                        CountryService.setCountryByCode($scope.countryIsoCode);
                    }

                    $scope.countryService = CountryService;

                    if ($scope.required === undefined) {
                        $scope.required = true;
                    }

                    $scope.countrySelected = function(selectedCountryCode) {
                        CountryService.setCountryByCode(selectedCountryCode);

                        $scope.country = CountryService.item.name;
                        $scope.countryIsoCode = CountryService.item.code;
                        $scope.state = '';
                    };
                };

                if (CountryService.data) {
                   setupCountrySelect();
                } else {
                    CountryService.get().then(function() {
                        setupCountrySelect();
                    });
                }
            }
        ]
    };
}])
.directive('stateSelect', [function () {
    return {
        restrict: 'A',
        scope: {
            stateCode: '=stateCode'
        },
        template: '<div ng-show="countryService.item.provinces.length > 0" class="form__field form__field--select" ' + 
        'ng-class="{\'form__field--has-alert\' : required && (form.$submitted && !form.country.$valid), \'form__field--required\' : required === true}">' +
        '<label ng-if="countryService.item.name.toLowerCase() !== \'canada\' && countryService.item.name.toLowerCase() !== \'ireland\'" translate="ADDRESS_MAN.COMMON.TXT_STATE"></label>' +
        '<label ng-if="countryService.item.name.toLowerCase() === \'canada\'" translate="ADDRESS.PROVINCE"></label>' +
        '<label ng-if="countryService.item.name.toLowerCase() === \'ireland\'" translate="ADDRESS.COUNTY"></label>' +
        '<select ng-model="stateCode" name="name" ng-change="provinceSelected(stateCode)" ng-required="countryService.item.provinces.length > 0">' +
            '<option value="" translate="LABEL.SELECT" ng-selected="!stateCode"></option>' +
            '<option ng-repeat="state in countryService.item.provinces" value="{{ state.code }}" ng-selected="state.code === stateCode">' +
                '{{state.name}}' +
            '</option>' +
        '</select></div>',
        controller: [
            '$scope',
            '$element',
            '$attrs',
            'CountryService',
            function($scope, $ele, $attrs, CountryService) {
                CountryService.setProvinceByCode($scope.stateCode);

                $scope.countryService = CountryService;

                if ($scope.required === undefined) {
                    $scope.required = true;
                }

                $scope.provinceSelected = function(provinceCode) {
                    CountryService.setProvinceByCode(provinceCode);

                    $scope.stateCode = CountryService.stateCode;
                };
            }
        ]
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
