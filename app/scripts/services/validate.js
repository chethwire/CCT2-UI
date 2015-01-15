'use strict';

angular.module('services.validate', ['services.crud', 'config'])


    .service('Validate', ['API_BASE_URL', '$http', function (API_BASE_URL, $http) {

        return {

            validateId: function (id, publisherId) {
                return $http({
                        method: 'GET',
                        url: API_BASE_URL + '?action=validatecsv&text-query=true&publisherId=' + publisherId + '&pubid=' + publisherId + '&id=' + id
                    }
                ).then(
                    //success handler
                    function (response) {

                        return response.data;
                    }
                );

            }
        }
    }]);