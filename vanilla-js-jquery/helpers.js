/* Global App Namespace */
var myApp = myApp || {};

(function(helpers) {

    //Bootstrap Helpers
    helpers.bootstrap = {};

    /**
     * @description Takes a vertical list inside a parent container and splits it into multiple vertical Bootstrap columns. Example method call: splitListToBootstrapColumns(".registrationCheckBox", ".checkbox", "form-group", "sm", 3);
     * @param {string} containerSelector - Options "[selector] - Parent container of the list
     * @param {string} childSelector - Options "[selector] | null" - Selector for the child elements to split into columns. Example ".user-address-info"
     * @param {string} rowType - Options "row | form-group"
     * @param {string} colSize - Options "xs | sm | md | lg"
     * @param {number} colNum - Options "1 | 2 | 3 | 4 | 6". Must be divisible by 12.
     */

    helpers.bootstrap.splitListToBootstrapColumns = function splitListToBootstrapColumns(containerSelector, childSelector, rowType, colSize, colNum) {
        var
            colNum = colNum,
            $containers = $(containerSelector),
            childSelector = childSelector ? childSelector : null;

        try {
            if ($.inArray(colNum, [1, 2, 3, 4, 6]) <= 0) {
                throw ("Number of columns passed to splitListToBootstrapColumns method must be one of the following: 1,2,3,4,6");
            }
        } catch (error) {
            console.error(error);
        }

        $containers.each(function(index) {
            var $this = $(this),
                $listArray = $this.children(childSelector),
                listTotal = $listArray.length,
                bsColumnClass = "col-" + colSize + "-" + (12 / colNum),
                count = Math.ceil(listTotal / colNum),
                column = 0;

            if (listTotal !== 0) {
                $this.addClass(rowType);

                for (var i = 0; i < listTotal; i += count) {
                    column++;
                    var colName = "split-column-" + column;
                    $this.append('<div class="' + colName + ' ' + bsColumnClass + '"></div>');
                    $this.find("." + colName).html($listArray.splice(0, count));
                }
            }
        });
    };

    //Address Bar Helpers
    helpers.addressBar = {};

    /**
     * @description Add a URL parameter (or update if already exists)
     * @param {string} url - url
     * @param {string} param - the key to set
     * @param {string} value - value
     */
    helpers.addressBar.addOrUpdateParameter = function addOrUpdateParameter(url, param, value) {
        param = encodeURIComponent(param);
        var r = "([&?]|&amp;)" + param + "\\b(?:=(?:[^&#]*))*";
        var a = document.createElement('a');
        var regex = new RegExp(r);
        var str = param + (value ? "=" + encodeURIComponent(value) : "");
        a.href = url;
        var q = a.search.replace(regex, "$1" + str);
        if (q === a.search) {
            a.search += (a.search ? "&" : "") + str;
        } else {
            a.search = q;
        }
        return a.href;
    };

    //Form Helpers
    helpers.form = {};

    /**
     * @description Clears all form elements.
     * @param {string} form element
     */
    helpers.form.clearForm = function clearForm(form) {
        // iterate over all of the inputs for the form element that was passed in
        $(':input', form).each(function() {
            var type = this.type;
            var tag = this.tagName.toLowerCase(); // normalize case

            if (type === 'text' || type === 'email' || type === 'password' || tag === 'textarea') {
                // it's ok to reset the value attr of text inputs,
                // password inputs, and textareas
                this.value = "";
            } else if (type === 'checkbox' || type === 'radio') {
                // checkboxes and radios need to have their checked state cleared
                // but should *not* have their 'value' changed
                this.checked = false;
            } else if (tag === 'select') {
                // select elements need to have their 'selectedIndex' property set to -1
                // (this works for both single and multiple select elements)
                this.selectedIndex = -1;
                //Iterate over all of the options and reselect the "selected" attributes. Also works for multiple selections with the "multiple" attribute.
                $(this).find('option').prop('selected', function() {
                    return this.defaultSelected;
                });
            }
        });
    };

    /**
     * @description Counts the number of characters the user is allowed to enter into an input or textarea
     * @param {string} inputElement - Options input element | textarea element
     * @param {string} outputCountContainer - Target element to output the count to
     * @element attribute {string} - maxlength attribute with a value needs to be set on the inputElement
     */
    helpers.form.characterCount = function characterCount(inputElement, outputCountContainer) {
        if (!(inputElement instanceof jQuery)) {
            var inputElement = $(inputElement);
        }

        //inputElement can be a input or textarea; a 'maxlength' attribute on the element is required in order to set the limit
        var maxLength = parseInt(inputElement.attr('maxlength'));

        //Catch Missing parameters
        try {
            if (!inputElement) {
                throw ("'inputElement' needs to be passed a jQuery object defined with $('.inputElementName')");
            }
            if (!outputCountContainer) {
                throw ("'outputCountContainer' needs to be specified to output add the remaining count to");
            }
            if (!maxLength) {
                throw ("'maxlength' attribute needs to be set on the input or textarea that characters are entered into");
            }
        } catch (error) {
            console.error(error);
        }

        var remainingChars = inputElement.val().length;

        $(outputCountContainer).html(remainingChars + " / " + maxLength);
    };


    //String Helpers
    helpers.string = {};

    /**
     * @description Truncates strings to characters with spaces length and re-trims string to keep whole words. Includes parameter to add Ellipsis at the end.
     * @param {string} string
     * @param {number} maxLength
     * @param {boolean} hasEllipsis
     * @returns {string}
     */
    helpers.string.truncateString = function truncateString(string, maxLength, hasEllipsis) {
        if (string && string.length > maxLength) {
            var trimmedString = string.substr(0, maxLength);

            trimmedString = trimmedString.substr(0, Math.min(trimmedString.length, trimmedString.lastIndexOf(" ")));

            if (hasEllipsis) {
                trimmedString = trimmedString + '\u2026';
            }
            return trimmedString;
        } else {
            return string;
        }
    };


})(myApp.helpers || (myApp.helpers = {}));