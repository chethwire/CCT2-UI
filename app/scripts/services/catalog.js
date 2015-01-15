'use strict';

angular.module('services.catalog', ['config'])
    .service('CatalogSvc', function Catalog($http, MODCATALOG_BASE_URL, CATALOG_BASE_URL) {
        return {

            createProductItem: function (data, publisherId) {
                return $http({
                    method: 'POST',
                    url: MODCATALOG_BASE_URL + '?action=createproductitem&publisherId=' + publisherId,
                    data: data,
                    headers: {'Content-Type': 'application/json'}
                })
                    .then(function (response) {
                        return response;

                    }, function (response) {
                        // Request failed
                        return response;
                    });
            },
            updateProductItem: function(data, publisherId) {
                return $http({
                    method: 'POST',
                    url: MODCATALOG_BASE_URL + '?action=updateproductitem&publisherId=' + publisherId,
                    data: data,
                    headers: {'Content-Type': 'application/json'}
                })
                    .then(function (response) {
                        return response;

                    }, function (response) {
                        // Request failed
                        return response;
                    });
            },
            getPrice: function (atompath, publisherId) {
                return $http({
                    method: 'GET',
                    //TODO remove hard coded publisher
                    url: CATALOG_BASE_URL + '?action=query&publisherId=' + publisherId + '&publisher=dupjnls&atompath=' + atompath
                })
                    .then(function (response) {
                        return response;

                    }, function (response) {
                        // Request failed
                        return response;
                    });
            }
        }
    });
