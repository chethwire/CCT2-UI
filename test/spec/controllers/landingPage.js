'use strict';

describe('Controller: LandingpageCtrl', function () {

  // load the controller's module
  beforeEach(module('landingPage'));

  var LandingpageCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    LandingpageCtrl = $controller('LandingpageCtrl', {
      $scope: scope
    });
  }));

  it('should have a value for apiBaseUrl', function () {
    expect(scope.apiBaseUrl).toBeDefined();
  });
});
