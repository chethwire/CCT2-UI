'use strict';

describe('Service: security', function () {

  // load the service's module
  beforeEach(module('cctuiApp'));

  // instantiate service
  var security;
  beforeEach(inject(function (_security_) {
    security = _security_;
  }));

  it('should do something', function () {
    expect(!!security).toBe(true);
  });

});
