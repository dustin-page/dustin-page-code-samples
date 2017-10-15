(function () {
    'use strict';

    angular
        .module('mb.custom.form.type.generator')
        .directive('customizationList', ['mbContext', customizationList]);

    function customizationList(mbContext) {
        var directive = {
            restrict: 'EA',
            templateUrl: '/app/catalog/customize/widgets/custom-form-type-generator/customization-list.template.html',
            scope: {
            },
            bindToController: {
                "customItemId": '@',
                "customItem": '=',
                "dropdownList": '=',
                "customizeState": '='
            },
            controller: CustomizationListController,
            controllerAs: 'clc'
        };

        return directive;
    }

    angular.module('mb.custom.form.type.generator').controller('CustomizationListController', CustomizationListController);

    CustomizationListController.$inject = ['$log', 'mbContext', 'CustomizationListService'];

    function CustomizationListController($log, mbContext, CustomizationListService) {

        var vm = this;

        vm.loading = false;
        vm.selectOption = selectOption;
        vm.hasChildList = hasChildList;
        vm.requiredSelectResetValidity = false;

        //////////////////////
        activate();

        function activate() {
            $log.info("customization-list.directive; activate called.");

            //Preselect the Dropdowns with saved data
            preselectDropdowns();
        }

        function selectOption(selectedOption) {
            // leaf node, no list to load
            if (angular.isDefined(selectedOption) && selectedOption !== null) {
                if (selectedOption.listId === null && selectedOption.value) {
                    vm.customItem.value = selectedOption.title;
                    vm.customItem.assetId = selectedOption.value;
                    vm.customItem.parentAssetListId = selectedOption.parentListId;
                    vm.selectedDropdownTwo = selectedOption;
                }
                    //Check to see if the object has "value" property that is empty, which would indicate it is a default selection.
                    //If the select element has the "required-select" attribute Angular will validate it
                else if (selectedOption.listId === null && (selectedOption.value === null || selectedOption.value === '')) {
                    vm.selectedDropdownOne = vm.customItem.optionList[0];
                }
                    // else check to see if this is has a child list and if it needs to pull its values from the server
                else if (angular.isDefined(selectedOption.listId) && selectedOption.listId !== null) {
                    vm.customItem.value = null;
                    vm.customItem.assetId = null;
                    vm.customItem.parentAssetListId = null;

                    var foundDropdown = null;
                    angular.forEach(vm.customItem.optionList, function (dropdown, dropdownKey) {
                        if (foundDropdown === null) {
                            if (dropdown.listId === selectedOption.listId) {
                                foundDropdown = dropdown;
                                if (foundDropdown.parentListId !== null) {
                                    foundDropdown.shown = true;
                                }
                            }
                            else if (dropdown.parentListId !== null) {
                                dropdown.shown = false;
                            }
                        }
                    });

                    vm.selectedDropdownOne = foundDropdown;


                    if (angular.isDefined(foundDropdown) && foundDropdown.list === null) {
                        vm.loading = true;
                        CustomizationListService.getList(mbContext.user.id,
                            selectedOption.parentListId,
                            selectedOption.listId).then(function (listModel) {
                                vm.loading = false;
                                vm.selectedDropdownOne.list = listModel.list;

                                //Set the default selection for selectedDropdownTwo once it is loaded
                                if (vm.selectedDropdownOne.list[0].value === null ||
                                    vm.selectedDropdownOne.list[0].value === "") {

                                    vm.selectedDropdownOne.list[0].resetValidityState = true; //Used for AngularJS Validation
                                    vm.selectedDropdownTwo = vm.selectedDropdownOne.list[0];
                                }
                            });
                    } else if (foundDropdown.list !== null) {

                        //Set the default selection for selectedDropdownTwo if the list was returned with the parent list or it already exists
                        if (vm.selectedDropdownOne.list[0].value === null || vm.selectedDropdownOne.list[0].value === "") {

                            vm.selectedDropdownOne.list[0].resetValidityState = true; //Used for AngularJS Validation
                            vm.selectedDropdownTwo = vm.selectedDropdownOne.list[0];
                        }
                    }

                }
            }
        }

        //Preselect the Dropdowns with saved data when directive is loaded
        function preselectDropdowns() {
            if (angular.isDefined(vm.customItem)) {

                var matchFound = false;

                angular.forEach(vm.customItem.optionList, function (dropdown, dropdownKey) {
                    //If a child list item was selected previously and saved it is reloaded with the GET request on page load without 
                    //making another call to the server
                    if (dropdown.list !== null) {
                        angular.forEach(dropdown.list, function (option, key) {
                            if (option.value === vm.customItem.assetId) {
                                //select option.
                                $log.info("dropdown [" + dropdown.title + "] at position " + dropdownKey + " should be selected here.");
                                //Preselect the first select dropdown
                                vm.selectedDropdownOne = dropdown;
                                $log.info("option [" + option.title + "] at position " + key + " should be selected here.");
                                //Preselect the second select dropdown
                                vm.selectedDropdownTwo = option;

                                matchFound = true;
                            }
                        });
                    }
                    else if (vm.customItem.assetId !== null && dropdown.value === vm.customItem.assetId) {
                        $log.info("dropdownOption [" + dropdown.title + "] should be selected here.");
                        //Preselect the first select dropdown
                        vm.selectedDropdownOne = dropdown;

                        matchFound = true;
                    } 

                });

                //If no match set default to first item in array
                if (!matchFound && vm.customItem.optionList !== null && Array.isArray(vm.customItem.optionList)) {
                    vm.selectedDropdownOne = vm.customItem.optionList[0];
                }
            }
        }

        function hasChildList(option) {
            if (option !== null &&
                angular.isDefined(option) &&
                angular.isDefined(option.list) &&
                option.list !== null) {
                return true;
            } else {
                return false;
            }
        }

    }
})();