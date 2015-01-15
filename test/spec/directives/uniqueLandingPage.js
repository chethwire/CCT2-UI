'use strict';

describe('Directive: uniqueLandingPage', function () {

    // load the directive's module
    beforeEach(module('cctuiApp', 'angulartics', 'angulartics.google.analytics'));

    var elm,
        $scope;
    var landingPages = ['lp1', 'landing page two', '123 34', '123-45'];

    beforeEach(inject(function ($rootScope, $compile) {
        elm = angular.element('<input unique-landing-page ng-model="obj">');
        $scope = $rootScope;
        $compile(elm)($scope);
        $scope.$digest();
    }));


    it('should set the landingPageId input to valid if a collection does not exist for given id', inject(function ($compile) {
        //browserTrigger(elm,"click");
//should this all be done in e2e instead?
    }));
});
