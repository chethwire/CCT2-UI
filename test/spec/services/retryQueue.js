'use strict';

describe('Service: retryQueue', function () {

  // load the service's module
  beforeEach(module('security.retryQueue'));

  // instantiate service
  var securityRetryQueue;
  beforeEach(inject(function (_securityRetryQueue_) {
      securityRetryQueue = _securityRetryQueue_;
  }));

  it('should do something', function () {
    expect(!!securityRetryQueue).toBe(true);
  });

});
