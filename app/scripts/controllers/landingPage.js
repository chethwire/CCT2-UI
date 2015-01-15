'use strict';

angular.module('landingPage', [
        'titleService',
        'security.authorization',
        'services.collections',
        'ngRoute',
        'config'
    ])

    .config(['$routeProvider', 'securityAuthorizationProvider', function ($routeProvider, securityAuthorizationProvider) {
        $routeProvider

            .when('/lp/:publisherId/:landingPageId', {
                templateUrl: '/views/landingPage.html',
                controller: 'LandingpageCtrl'
            })
        ;
    }])
    .controller('LandingpageCtrl', ['$scope', '$routeParams', 'titleService', 'Collectionssvc', 'API_BASE_URL', function ($scope, $routeParams, titleService, Collectionssvc, API_BASE_URL) {
        $scope.apiBaseUrl = API_BASE_URL;
        var landingPageId = $routeParams.landingPageId;
        var publisherId = $routeParams.publisherId;
        Collectionssvc.getCollectionByLandingPageId(landingPageId, publisherId).then(function (result) {
            $scope.collection = result;
            var title = $scope.collection.name;
            titleService.setTitle(title);
        }, function (x) {

        });


    }]);
