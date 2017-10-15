/**
 * @ngdoc directive
 * @name uiSelectRequired
 * @author Dustin Page <dustin_page@gage.com>
 * @restrict A
 *
 * @description
 * uiSelectRequired is a custom validator for the AngularJS UI Select library that adds the uiSelectRequired validator to ngModel.
 * It validates single and multiple selects in the ui-select directive. ui-select can also use the ngRequired directive, but it is not
 * implemented correctly with multiple selects.
 *
 * @requires ui-select <https://angular-ui.github.io/ui-select/>
 *
 * @attribute [ng-model-options="{ allowInvalid: true }"] - The ng-model-options option allowInvalid: true must be set on the ui-select element for this directive to work correctly
 *
 * @example
 * <ui-select
 *            multiple
 *            register-custom-form-control <!-- This attribute allows angular-auto-validate library to auto generate a custom validation message -->
 *            tagging="true"
 *            tagging-label="(New Email Address)"
 *            ng-model="vm.emailArray"
 *            ng-model-options="{ allowInvalid: true }"
 *            ui-select-required="true"
 *            title="Type An Email Address And Click Enter"
 *            theme="bootstrap">
 *     <ui-select-match placeholder="Type An Email Address And Click Enter">{{$item}}</ui-select-match>
 *     <ui-select-choices repeat="seed in vm.emailArray">
 *         {{seed}}
 *     </ui-select-choices>
 * </ui-select>
 */

angular.module('form.validators')
    .directive('uiSelectRequired', function () {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, element, attr, ctrl) {
                ctrl.$validators.uiSelectRequired = function (modelValue, viewValue) {

                    if (attr.uiSelectRequired) {
                        var isRequired = scope.$eval(attr.uiSelectRequired);
                        if (isRequired === false)
                            return true;
                    }

                    var determineVal;
                    if (angular.isArray(modelValue)) {
                        determineVal = modelValue;
                    } else if (angular.isArray(viewValue)) {
                        determineVal = viewValue;
                    } else if (angular.isObject(modelValue)) {
                        determineVal = angular.equals(modelValue, {}) ? [] : ['true'];
                    } else if (angular.isObject(viewValue)) {
                        determineVal = angular.equals(viewValue, {}) ? [] : ['true'];
                    } else {
                        return false;
                    }
                    return determineVal.length > 0;
                };
            }
        };
    });