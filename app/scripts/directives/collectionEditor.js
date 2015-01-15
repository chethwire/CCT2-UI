'use strict';

angular.module('directives.collectionEditor', ['services.collections', 'security.authorization'])
    .directive('collectionEditor', function (Collectionssvc, security) {
        return {
            templateUrl: '/views/templates/collectionEditor.tpl.html',
            restrict: 'E',
            replace: true,
            scope: true,
            link: function postLink(scope, element, attrs) {
                //element.text('this is the collectionEditor directive');


            }
        };
    });
