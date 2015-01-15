'use strict';

angular.module('health', ['config'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider

            .when('/health', {
                templateUrl: '/views/health.html',
                controller: 'HealthCtrl'
            })
        ;
    }])
    .controller('HealthCtrl', ['$scope', '$routeParams', 'Collectionssvc', '$http', function ($scope, $routeParams, Collectionssvc, $http) {
        //check ccts service

        $scope.status = '';
        $http({
            method: 'GET',
            url: '/svc/getfile?fileId=0&publisherId=doesntmatter'
        })
            .then(
            //success handler
            function (response) {
                $scope.status = "ITSALLGOOD";
            }, function (x) {
                //if we get here there was a problem with the request to the server

                $scope.status = 'THINGSDONTLOOKSOGOOD (Exception: ' + JSON.stringify(x) + ')';
            });

    }]);
