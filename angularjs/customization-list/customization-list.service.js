(function () {
    'use strict';

    angular.module('mb.custom.form.type.generator')
        .factory('CustomizationListService', CustomizationListService);

    CustomizationListService.$inject = ['$http', '$q', '$timeout', '$cacheFactory', 'mbContext', '$log'];

    function CustomizationListService($http, $q, $timeout, $cacheFactory, mbContext, $log) {
        var ClassName = 'CustomizationListService';

        //Create a cache object in the $cacheFactory to store each list requested by the user
        //The key in the cache is the Url used to make the request
        var customizationListCache = $cacheFactory('customizationListCache');

        var service = {
            getList: getList
        };

        return service;

        ////////////////

        function getDataComplete(response, status, headers, config) {
            var modelData = response.data;
            return modelData;
        }

        function httpError(response, status, headers, config) {
            var summary = ClassName + '.getList(): $http.get failed. Url: ' + url;
            $log.warn(summary);

            var detail = summary +
                '\nConfig: ' + mbUtils.toJson(config) +
                '\nStatus: ' + mbUtils.toJson(status) +
                '\nResponse: ' + mbUtils.toJson(response);
            return $q.reject(detail);
        }

        function getUrl(userId, parentListId, listId) {
            var url = mbContext.configs.apiUrlPrefix + '/api/customizations/' + userId + '/lists/' + parentListId + '/' + listId;
            return url;
        }

        function getList(userId, parentListId, listId) {

            var url = getUrl(userId, parentListId, listId);

            return $http.get(url, {
                ignoreLoadingBar: true,
                cache: customizationListCache
            })
                .then(getDataComplete, httpError);

        }
    }
})();