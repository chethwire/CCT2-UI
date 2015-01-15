'use strict';

angular.module('rss', [
        'services.collections',
        'ngRoute',
        'config'
    ])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider

            .when('/rss/:publisherId/:rssId', {
                templateUrl: '/views/rss.html',
                controller: 'RssCtrl'
            })
        ;
    }])
    .controller('RssCtrl', ['$scope', '$routeParams', 'Collectionssvc', 'BASE_URL', function ($scope, $routeParams,  Collectionssvc, BASE_URL) {
        $scope.baseUrl = BASE_URL;
        var rssId = $routeParams.rssId;
        var publisherId = $routeParams.publisherId;
        Collectionssvc.getCollectionByRssId(rssId, publisherId).then(function (collection) {
            var rssUrl = BASE_URL + '/getfile?fileId=' + collection.rssUploadId + '&publisherId=' + publisherId;
            window.location.href = rssUrl;

        });

    }]);
