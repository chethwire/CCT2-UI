'use strict';

describe('Service: notifications', function () {

  // load the service's module
  beforeEach(module('cctuiApp'));

  // instantiate service
  var notifications;
  beforeEach(inject(function (_notifications_) {
    notifications = _notifications_;
  }));

  it('should do something', function () {
    expect(!!notifications).toBe(true);
  });

});