'use strict';

describe('Service: interceptor', function () {

  // load the service's module
  beforeEach(module('security.interceptor'));

  // instantiate service
  var securityInterceptor;
  beforeEach(inject(function (_securityInterceptor_) {
      securityInterceptor = _securityInterceptor_;
  }));

  it('should do something', function () {
    expect(!!securityInterceptor).toBe(true);
  });

});
