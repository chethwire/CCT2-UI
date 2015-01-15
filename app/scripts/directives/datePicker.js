'use strict';

angular.module('directives.datePicker',[])
    .directive('datePicker', function () {
        return {
            require: 'ngModel',
            link: function (scope, element, attrs, ngModelCtrl) {
                ngModelCtrl.$formatters.push(function (date) {
                   if (angular.isDefined(date) && date !== null && !angular.isDate(date)) {
                        throw new Error('ng-Model value must be a Date object');
                    }
                    ;
                    return date;
                });
                var updateModel = function () {
                    scope.$apply(function () {                        
                        var date = element.datepicker("setDate", element.val());
                        ngModelCtrl.$setViewValue(date);
                    });

                };
                var onSelectHandler = function (userHandler) {
                    if (userHandler) {
                        return function (value, picker) {
                            updateModel();
                            return userHandler(value, picker);
                        };
                    } else {
                        return updateModel;                        
                    }
                };
                var setUpDatePicker = function () {
                    element.datepicker({minDate:attrs.min});  //setting minimum startdate to be current                      
                    var options = scope.$eval(attrs.datePicker) || {};
                    options.onSelect = onSelectHandler(options.onSelect);
                    element.bind('change', updateModel);
                    // element.datepicker('destroy');//this line needs to be commented to allow change in min startdate.
                    element.datepicker(options);
                    ngModelCtrl.$render();
                };
                ngModelCtrl.$render = function () {
                    element.datepicker("setDate", ngModelCtrl.$viewValue);
                };
                scope.$watch(attrs.datePicker, setUpDatePicker, true);
                
            }
        };
    });
