
(function () {
    'use strict';

    angular
      .module('mb.custom.form.type.generator')
      .directive('customFormTypeGenerator', ['$window', customFormTypeGenerator]);

    function customFormTypeGenerator($window) {
        var directive = {
            restrict: 'E',
            template: '<ng-include class="custom-form-type-generator-container" src="vm.customFormTypeTemplateUrl"></ng-include>',
            require: '^^form',
            scope: {
            },
            bindToController: {
                customItem: '=data'
            },
            controller: CustomFormTypeGeneratorCtrl, //Embed a custom controller in the directive
            controllerAs: 'vm',
            link: link
        };

        function link(scope, element, attrs, ctrl) {
            scope.parentFormController = ctrl;
        }

        return directive;
    }

    CustomFormTypeGeneratorCtrl.$inject = ['$log', '$scope', 'mbContext', 'customizeService'];

    function CustomFormTypeGeneratorCtrl($log, $scope, mbContext, customizeService) {

        var vm = this;

        var className = 'CustomFormTypeGeneratorCtrl';

        //IMPORTED SERVICES
        vm.customizeState = customizeService.customizeState;

        //PUBLIC METHODS

        //Moved the getTemplateUrl function into controller to prevent it from being re-evaluated on ngIncludes src attribute on each $digest cycle
        vm.customFormTypeTemplateUrl = getTemplateUrl(vm.customItem.type);

        ////////////////////////////
        activate();

        function activate() {
            /* Image Type Methods */
            if (vm.customItem.type === 'image') {
                vm.isImageBeingEdited = false;

                vm.onImageEdit = function () {
                    vm.isImageBeingEdited = true;
                }

                vm.getImageUrl = function (image) {
                    return image && image.imageUrl ? mbContext.configs.webUrlPrefix + image.imageUrl : null;
                }
            }

        };

        //function used on the ng-include to resolve the template
        function getTemplateUrl(customType) {
            var template = '';

            switch (customType) {
                case 'address': //App type
                case 'address_component': //Type from customization
                    template = '/app/catalog/customize/widgets/custom-form-type-generator/address-type.template.html';
                    break;
                case 'radio': //App type
                case 'textRadio': //Type from customization
                    template = '/app/catalog/customize/widgets/custom-form-type-generator/radio-type.template.html';
                    break;
                case 'text': //App type
                case 'shortText': //Type from customization
                    template = '/app/catalog/customize/widgets/custom-form-type-generator/text-type.template.html';
                    break;
                case 'email': //Type from customization
                    template = '/app/catalog/customize/widgets/custom-form-type-generator/email-type.template.html';
                    break;
                case 'image': //Type from customization
                    template = '/app/catalog/customize/widgets/custom-form-type-generator/image-upload-type.template.html';
                    break;
                case 'textarea': //App type
                case 'longTextSecondary': //Type from customization
                    template = '/app/catalog/customize/widgets/custom-form-type-generator/textarea-type.template.html';
                    break;
                case 'select': //App type
                case 'textDropdown': //Type from customization
                    template = '/app/catalog/customize/widgets/custom-form-type-generator/select-type.template.html';
                    break;
                default:
                    template = '/app/catalog/customize/widgets/custom-form-type-generator/default-type.template.html';
                    var summary = className + '.getTemplateUrl() does not have a template specified for customType = ' + customType + ' in Variable: ' + vm.customItem.name + '(' + vm.customItem.customizationName + ')';
                    $log.error(summary);
            }

            return template;
        }

    }

})();

