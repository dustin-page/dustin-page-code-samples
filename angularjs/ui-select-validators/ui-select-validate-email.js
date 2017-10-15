/**
 * @ngdoc directive
 * @name uiSelectValidateEmail
 * @author Dustin Page <dustin_page@gage.com>
 * @restrict A
 *
 * @description
 * uiSelectRequired is a custom validator for the AngularJS UI Select library that adds the uiSelectValidateEmail validator to ngModel.
 * It validates that an array of email addresses are a valid type.
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
 *            ui-select-validate-email="true"
 *            title="Type An Email Address And Click Enter"
 *            theme="bootstrap">
 *     <ui-select-match placeholder="Type An Email Address And Click Enter">{{$item}}</ui-select-match>
 *     <ui-select-choices repeat="seed in vm.emailArray">
 *         {{seed}}
 *     </ui-select-choices>
 * </ui-select>
 */

angular.module('form.validators')
    .directive('uiSelectValidateEmail', function () {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, element, attr, ctrl) {

                var EMAIL_REGEXP = /^(?=.{1,254}$)(?=.{1,64}@)[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+(\.[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+)*@[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?(\.[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*$/;

                ctrl.$validators.uiSelectValidateEmail = function (modelValue, viewValue) {

                    var value = modelValue || viewValue;
                    var isValid = false;

                    if (ctrl.$isEmpty(value)) {
                        isValid = true;
                    } else if (angular.isArray(value)) {

                        //Validate that all email addresses are valid
                        for (var i = 0; i < value.length; i++) {
                            var emailValue = value[i];

                            isValid = EMAIL_REGEXP.test(emailValue);
                            if (!isValid) {
                                //When you find the first invalid email address stop checking
                                break;
                            }
                        }
                    }

                    return isValid;

                };
            }
        };
    });