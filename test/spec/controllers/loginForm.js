'use strict';

describe('Controller: LoginformCtrl', function () {

  // load the controller's module
  beforeEach(module('security.login.form','cctuiApp'));

  var LoginformCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    LoginformCtrl = $controller('LoginFormController', {
      $scope: scope
    });
  }));

  it('should do something', function () {
    expect(scope.user).toBe({});
  });
});
