(function () {
    'use strict';

    angular.module('mb.shared.services')
        .factory('customBundleDataService', customBundleDataService);

    customBundleDataService.$inject = ['$http', '$q', '$log', '$timeout', 'mbContext'];

    function customBundleDataService($http, $q, $log, $timeout, mbContext) {

        var ClassName = 'customBundleDataService';
        var service = {
            getCustomBundle: getCustomBundle,
            resubmitCustomBundle: resubmitCustomBundle,
            updateCustomBundle: updateCustomBundle
        };

        activate();

        return service;

        ////////////////
        function activate() {
        }

        function getUrl(bundleId) {
            //Endpoint for Custom Bundle with multiple items:
            var url = '/api/newcustombundles/' + bundleId;

            return url;
        }

        function getCustomBundle(bundleId) {

            var url = getUrl(bundleId);

            var httpConfig = {
                cache: true //Cache the initial request
            }

            return $http.get(url, httpConfig)
                .then(successCallback, errorCallback);

            function successCallback(response) {
                return response.data;
            }

            function errorCallback(response) {
                var summary = ClassName + '.getCustomBundle(): $http.get failed. Url: ' + url;
                var detail = summary +
                    '\n Response: ' + JSON.stringify(response);

                $log.warn(summary);

                return $q.reject(detail);
            }
        }

        function resubmitCustomBundle(bundleData) {

            var url = '/api/custombundles/' + bundleData.id + '/resubmit';

            return $http.put(url, bundleData)
                .then(successCallback, errorCallback);

            function successCallback(response) {
                return response.data;
            }

            function errorCallback(response, status, headers, config, method) {
                var summary = ClassName + 'CustomBundleService resubmitCustomBundle: $http.' + method + ' failed. Url: ' + url;
                var detail = summary +
                    '\nConfig: ' + JSON.stringify(config) +
                    '\nStatus: ' + JSON.stringify(status) +
                    '\nResponse: ' + JSON.stringify(response);

                $log.warn(summary);

                return $q.reject(detail);
            }
        }


        function updateCustomBundle(bundleId, bundleData) {
            var url = getUrl(bundleId);

            return $http.put(url, bundleData)
                .then(successCallback, errorCallback);

            function successCallback(response) {
                return response.data;
            }

            function errorCallback(response, status, headers, config, method) {
                var summary = ClassName + 'CustomBundleService updateCustombundle: $http.' + method + ' failed. Url: ' + url;
                var detail = summary +
                    '\nConfig: ' + JSON.stringify(config) +
                    '\nStatus: ' + JSON.stringify(status) +
                    '\nResponse: ' + JSON.stringify(response);

                $log.warn(summary);

                return $q.reject(detail);
            }
        }
    }
})();