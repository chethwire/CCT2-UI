'use strict';

describe('Service: i18nNotifications', function () {

  // load the service's module
  beforeEach(module('services.i18nNotifications','cctuiApp'));

  // instantiate service
  var i18nNotifications;
  beforeEach(inject(function (_i18nNotifications_) {
    i18nNotifications = _i18nNotifications_;
  }));

  it('should do something', function () {
    expect(!!i18nNotifications).toBe(true);
  });

});
